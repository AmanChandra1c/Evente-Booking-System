import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/Context";
import API from "../../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { Card, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import BookingSuccess from "../components/BookingSuccess";

const EventDetails = () => {
  const { events, user, setEvents } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bookingData, setBookingData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState(null);

  // Find the event from the events array
  const event = events.find(e => e._id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card glass>
          <CardBody className="text-center p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
            <p className="text-slate-300 mb-6">The event you're looking for doesn't exist</p>
            <Button 
              variant="primary" 
              onClick={() => navigate("/events")}
            >
              Back to Events
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to book events");
      navigate("/login");
      return;
    }

    if (!bookingData.name || !bookingData.email || !bookingData.mobile) {
      toast.error("All fields are required");
      return;
    }

    if (bookingData.quantity > event.availableSeats) {
      toast.error(`Only ${event.availableSeats} seats available`);
      return;
    }

    setLoading(true);
    
    try {
      const res = await API.post("/booking/", {
        eventId: event._id,
        ...bookingData,
      });
      
      // Set success data for the modal
      setSuccessBookingData({
        ...res.data.data,
        totalAmount: bookingData.quantity * event.price,
      });
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
      setShowBookingForm(false);
      
      // Update events state in real-time to reflect new seat availability
      const updatedEvents = events.map(evt => {
        if (evt._id === event._id) {
          // Calculate new availability
          const bookedSeats = (evt.bookedSeats || 0) + bookingData.quantity;
          const availableSeats = Math.max(0, evt.totalSeats - bookedSeats);
          
          return {
            ...evt,
            bookedSeats: bookedSeats,
            availableSeats: availableSeats
          };
        }
        return evt;
      });
      
      setEvents(updatedEvents);
      
      // Reset form
      setBookingData({
        name: user?.name || "",
        email: user?.email || "",
        mobile: "",
        quantity: 1,
      });
      
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessBookingData(null);
    // No need to refresh - state is already updated in real-time
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Hero Section with Background */}
      <ScrollReveal direction="down" delay={0.1}>
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="absolute inset-0">
              <div className="h-full w-full opacity-20">
                <div className="h-full w-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
                <div className="h-full w-full bg-gradient-to-tr from-pink-600/5 via-blue-600/5 to-purple-600/5"></div>
                <div className="h-full w-full bg-gradient-to-bl from-purple-600/3 via-blue-600/3 to-pink-600/3"></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/events")}
              className="mb-6"
            >
              ← Back to Events
            </Button>

            <Card glass className="overflow-hidden">
              {/* Event Image */}
              <div className="h-96 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
                <img className="w-full h-full object-cover" src={event.img} alt={event.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                      {event.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Event Details */}
              <CardBody className="p-4 sm:p-6 md:p-8">
                <ScrollReveal direction="up" delay={0.2}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left Column - Event Info */}
                    <div>
                      <div className="space-y-4 sm:space-y-6 mb-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs sm:text-sm">Location</p>
                            <p className="text-white font-semibold text-sm sm:text-base">{event.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs sm:text-sm">Date</p>
                            <p className="text-white font-semibold text-sm sm:text-base">{formatDate(event.date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs sm:text-sm">Price</p>
                            <p className="text-xl sm:text-2xl font-bold text-gradient">
                              ${event.price} <span className="text-xs sm:text-sm font-normal text-slate-400">per ticket</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-400 text-xs sm:text-sm">Availability</p>
                            <p className="text-white font-semibold text-sm sm:text-base">
                              {event.availableSeats} of {event.totalSeats} seats available
                            </p>
                            <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2 mt-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 sm:h-2 rounded-full"
                                style={{ 
                                  width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Description</h3>
                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div>
                      <Card glass className="h-full">
                        <CardBody className="p-4 sm:p-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                            Book This Event
                          </h3>
                          
                          {!showBookingForm ? (
                            <div>
                              <div className="mb-4 sm:mb-6">
                                <p className="text-slate-300 mb-2 text-sm sm:text-base">
                                  Total Price: 
                                  <span className="text-2xl sm:text-3xl font-bold text-gradient ml-2">
                                    ${event.price * bookingData.quantity}
                                  </span>
                                </p>
                              </div>
                              
                              <Button
                                variant="primary"
                                onClick={() => setShowBookingForm(true)}
                                disabled={event.availableSeats === 0}
                                className="w-full text-sm sm:text-base py-2.5 sm:py-3"
                                size="lg"
                              >
                                {event.availableSeats === 0 ? "Sold Out" : "🎟️ Book Now"}
                              </Button>
                            </div>
                          ) : (
                            <form onSubmit={handleBooking} className="space-y-3 sm:space-y-4">
                              <Input
                                label="Name"
                                type="text"
                                name="name"
                                value={bookingData.name}
                                onChange={handleChange}
                                required
                                glass
                              />
                              
                              <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={bookingData.email}
                                onChange={handleChange}
                                required
                                glass
                              />
                              
                              <Input
                                label="Mobile Number"
                                type="tel"
                                name="mobile"
                                value={bookingData.mobile}
                                onChange={handleChange}
                                required
                                placeholder="Enter your mobile number"
                                glass
                              />
                              
                              <Input
                                label="Number of Tickets"
                                type="number"
                                name="quantity"
                                value={bookingData.quantity}
                                onChange={handleChange}
                                min="1"
                                max={event.availableSeats}
                                required
                                glass
                              />
                              
                              <div className="pt-2">
                                <p className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                                  Total: <span className="text-gradient">${event.price * bookingData.quantity}</span>
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="primary"
                                    className="flex-1 text-sm sm:text-base py-2.5 sm:py-3"
                                  >
                                    {loading ? (
                                      <span className="flex items-center justify-center gap-2">
                                        <Spinner size="small" />
                                        Processing...
                                      </span>
                                    ) : (
                                      "🎉 Confirm Booking"
                                    )}
                                  </Button>
                                  
                                  <Button
                                    type="button"
                                    onClick={() => setShowBookingForm(false)}
                                    variant="outline"
                                    className="flex-1 text-sm sm:text-base py-2.5 sm:py-3"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </form>
                          )}
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </ScrollReveal>
              </CardBody>
            </Card>
          </div>
        </div>
      </ScrollReveal>

      {/* Success Modal */}
      {showSuccessModal && successBookingData && (
        <BookingSuccess
          bookingData={successBookingData}
          eventData={event}
          onClose={handleCloseSuccessModal}
        />
      )}
    </div>
  );
};

export default EventDetails;
