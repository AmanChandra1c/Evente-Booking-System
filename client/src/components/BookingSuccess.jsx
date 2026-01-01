import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody } from "./ui/Card";
import Button from "./ui/Button";

const BookingSuccess = ({ bookingData, eventData, onClose }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a short delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Hide confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  [
                    "bg-yellow-400",
                    "bg-red-400", 
                    "bg-blue-400",
                    "bg-green-400",
                    "bg-purple-400",
                    "bg-pink-400",
                  ][Math.floor(Math.random() * 6)]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-md w-full"
      >
        <Card glass>
          <CardBody className="p-8">
            {/* Success Icon with Animation */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
                  className="text-4xl"
                >
                  ✅
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-3xl font-bold text-white mb-2"
              >
                🎉 Hooray! Booking Confirmed!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-slate-300"
              >
                Your tickets have been booked successfully
              </motion.p>
            </div>

            {/* Booking Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl p-6 mb-6 border border-blue-500/30"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🎫</span>
                Booking Details
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold text-white">{eventData.title}</p>
                    <p className="text-sm text-slate-400">Event</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-medium text-white">
                      {eventData.location}
                    </p>
                    <p className="text-sm text-slate-400">Venue</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-medium text-white">
                      {formatDate(eventData.date)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {formatTime(eventData.date)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Tickets</p>
                      <p className="font-semibold text-white">
                        {bookingData.quantity} × ${eventData.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Total Paid</p>
                      <p className="text-2xl font-bold text-gradient">
                        ${bookingData.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="bg-slate-800/60 rounded-lg p-4 mb-6 border border-slate-600"
            >
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-400">Booking ID</p>
                  <p className="font-mono font-semibold text-white">
                    #{bookingData._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Booked on</p>
                  <p className="font-medium text-white">
                    {new Date(bookingData.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex gap-3"
            >
              <Link to="/" className="flex-1">
                <Button variant="primary" className="w-full">
                  View My Bookings
                </Button>
              </Link>
              <Link to="/events" className="flex-1">
                <Button variant="outline" className="w-full">
                  Browse More Events
                </Button>
              </Link>
            </motion.div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
