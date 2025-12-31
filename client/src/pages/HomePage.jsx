import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/Context";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

const HomePage = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!loading && user && user.role === "admin") {
      navigate("/admin");
      return;
    }
  }, [user, loading, navigate, location]);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const res = await API.get("/booking/");
        setBookings(res.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Error fetching your bookings");
      } finally {
        setBookingsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 container mx-auto px-4">
      <Navbar />

      {/* User Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Bookings Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Bookings</h2>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
        
        {bookingsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${booking.eventId._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.eventId?.title || "Event"}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 {booking.eventId?.location || "Location"}</p>
                  <p>📅 {booking.eventId ? formatDate(booking.eventId.date) : formatDate(booking.bookingDate)}</p>
                  <p>🎫 {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</p>
                  <p>💰 Total: ${booking.totalAmount}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Booked on {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring events and book your first experience!
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explore Events
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
