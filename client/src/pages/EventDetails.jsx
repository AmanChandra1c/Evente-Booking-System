import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/Context";
import API from "../../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import BookingSuccess from "../components/BookingSuccess";

const EventDetails = () => {
  const { events, user } = useContext(UserContext);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
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
    // Refresh events to update seat count
    window.location.reload();
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/events")}
          className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="h-96 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            {/* <h1 className="text-4xl font-bold text-white text-center px-4">
              {event.title}
            </h1> */}
            <img className="w-full object-center" src={event.img} alt={event.title} />
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Event Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {event.title}
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-semibold text-gray-700">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-gray-700">Date</p>
                      <p className="text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎫</span>
                    <div>
                      <p className="font-semibold text-gray-700">Price</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${event.price} per ticket
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💺</span>
                    <div>
                      <p className="font-semibold text-gray-700">Availability</p>
                      <p className="text-gray-600">
                        {event.availableSeats} of {event.totalSeats} seats available
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ 
                            width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Right Column - Booking */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Book This Event
                  </h3>
                  
                  {!showBookingForm ? (
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-600 mb-2">
                          Total Price: 
                          <span className="text-2xl font-bold text-indigo-600 ml-2">
                            ${event.price * bookingData.quantity}
                          </span>
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setShowBookingForm(true)}
                        disabled={event.availableSeats === 0}
                        className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                          event.availableSeats === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                        }`}
                      >
                        {event.availableSeats === 0 ? "Sold Out" : "🎟️ Book Now"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={bookingData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={bookingData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={bookingData.mobile}
                          onChange={handleChange}
                          required
                          placeholder="Enter your mobile number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Tickets
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={bookingData.quantity}
                          onChange={handleChange}
                          min="1"
                          max={event.availableSeats}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-lg font-semibold text-gray-800 mb-3">
                          Total: ${event.price * bookingData.quantity}
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </span>
                            ) : (
                              "🎉 Confirm Booking"
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
