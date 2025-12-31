import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../context/Context";
import API from "../../api/axios";

const CreateEvent = () => {
  const { setLoading } = useContext(UserContext);

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

    if (
      !title ||
      !description ||
      !location ||
      !date ||
      !totalSeats ||
      !price ||
      !img
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/event/create-event", formData);

      toast.success("Event created successfully 🎉");

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
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          to="/admin"
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create New Event 🎉
        </h1>
        <p className="text-gray-500 mb-6">
          Fill the details below to publish a new event
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Event location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Seats & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                placeholder="Enter total seats"
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block font-medium mb-1">Event Image URL</label>
            <input
              type="text"
              name="img"
              placeholder="https://example.com/image.jpg"
              value={formData.img}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Event Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe your event"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Event
            </button>

            <Link
              to="/admin"
              className="flex-1 text-center border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
