import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { UserContext } from "../../context/Context";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import Input from "../components/ui/Input";
import API from "../../api/axios";

const CreateEvent = () => {
  const { setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    totalSeats: "",
    price: "",
    img: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, location, date, totalSeats, price, img } =
      formData;

    if (!title || !description || !location || !date || !totalSeats || !price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/event/create-event", formData);
      toast.success("Event created successfully ");

      // Reset form after success
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        totalSeats: "",
        price: "",
        img: "",
      });

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ScrollReveal direction="down" delay={0.1}>
          <div className="text-center mb-8">
            <Link
              to="/admin"
              className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </Link>

            <motion.h1
              className="text-4xl font-bold text-gradient mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              Create New Event
            </motion.h1>

            <p className="text-slate-400 text-lg">
              Fill in the details below to create your amazing event
            </p>
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal direction="up" delay={0.2}>
          <Card glass className="overflow-hidden">
            <CardBody className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Event Title */}
                <div>
                  <Input
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging event title..."
                    required
                    glass
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event in detail..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/60 backdrop-blur border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                {/* Location and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Event Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where will your event take place?"
                    required
                    glass
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Event Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      className="w-full px-4 py-3 bg-slate-800/60 backdrop-blur border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Seats and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Total Seats Available"
                    name="totalSeats"
                    type="number"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    placeholder="How many people can attend?"
                    min="1"
                    required
                    glass
                  />

                  <Input
                    label="Ticket Price ($)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Set your ticket price..."
                    min="0"
                    step="0.01"
                    required
                    glass
                  />
                </div>

                {/* Image URL */}
                <div>
                  <Input
                    label="Event Image URL (Optional)"
                    name="img"
                    type="url"
                    value={formData.img}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
                    glass
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    size="lg"
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Event
                    </span>
                  </Button>

                  <Link to="/admin" className="flex-1">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardBody>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default CreateEvent;
