import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../../context/Context";
import Navbar from "../components/Navbar";
import { Card, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import Button from "../components/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

const HomePage = () => {
  const { user, loading, events } = useContext(UserContext);
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

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const res = await API.get("/booking");
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M4 4H8v16M8 4H4z" />
            </svg>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Hero Section */}
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

          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gradient mb-4 sm:mb-6">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                  Ready to discover amazing events? Your next adventure awaits!
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats and Quick Actions */}
      <ScrollReveal direction="up" delay={0.3}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card glass className="hover-lift">
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gradient">{events?.length || 0}</p>
                      <p className="text-sm sm:text-base text-slate-300">Total Events</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card glass className="hover-lift">
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gradient">{bookings?.length || 0}</p>
                      <p className="text-sm sm:text-base text-slate-300">Your Bookings</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card glass className="hover-lift h-full">
                <CardBody className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <Button 
                      variant="primary" 
                      onClick={() => navigate("/events")}
                      className="w-full text-sm sm:text-base py-2.5 sm:py-3"
                    >
                      Browse Events
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Bookings Section */}
      <ScrollReveal direction="up" delay={0.5}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">Your Recent Bookings</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/events")}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              View All Events
            </Button>
          </div>

          {bookingsLoading ? (
            <div className="text-center py-12 sm:py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M4 4H8v16M8 4H4z" />
                  </svg>
                </div>
              </motion.div>
              <p className="text-slate-300 mt-4 text-sm sm:text-base">Loading your bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card glass className="hover-lift">
                    <CardBody className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {booking.eventId?.title || "Event"}
                          </h3>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            booking.status === "confirmed" 
                              ? "bg-green-100 text-green-600" 
                              : "bg-yellow-100 text-yellow-600"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => navigate(`/events/${booking.eventId._id}`)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-300">
                        <p className="flex items-center gap-2">
                          <span className="text-blue-400">📅</span>
                          Booked on {formatDate(booking.bookingDate)}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-green-400">🎫</span>
                          {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-purple-400">💰</span>
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card glass className="text-center py-12">
              <CardBody>
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Bookings Yet</h3>
                <p className="text-slate-300 mb-6">Start exploring events and book your first experience!</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate("/events")}
                  className="mx-auto"
                >
                  Explore Events
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HomePage;
