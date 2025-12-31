import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
      <div
        className={`bg-white rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-700 ${
          showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {/* Success Icon with Animation */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <div
              className={`text-4xl transition-all duration-1000 ${
                showContent ? "scale-100" : "scale-0"
              }`}
              style={{
                animation: showContent
                  ? "popIn 0.5s ease-out 0.3s forwards"
                  : "none",
              }}
            >
              ✅
            </div>
          </div>

          <h2
            className={`text-3xl font-bold text-gray-800 mb-2 transition-all duration-700 ${
              showContent
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            🎉 Hooray! Booking Confirmed!
          </h2>

          <p
            className={`text-gray-600 transition-all duration-700 delay-100 ${
              showContent
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            Your tickets have been booked successfully
          </p>
        </div>

        {/* Booking Details */}
        <div
          className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 transition-all duration-700 delay-200 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🎫</span>
            Booking Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-semibold text-gray-800">{eventData.title}</p>
                <p className="text-sm text-gray-600">Event</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-medium text-gray-800">
                  {eventData.location}
                </p>
                <p className="text-sm text-gray-600">Venue</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-medium text-gray-800">
                  {formatDate(eventData.date)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(eventData.date)}
                </p>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Tickets</p>
                  <p className="font-semibold text-gray-800">
                    {bookingData.quantity} × ${eventData.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${bookingData.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Info */}
        <div
          className={`bg-gray-50 rounded-lg p-4 mb-6 transition-all duration-700 delay-300 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-600">Booking ID</p>
              <p className="font-mono font-semibold text-gray-800">
                #{bookingData._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Booked on</p>
              <p className="font-medium text-gray-800">
                {new Date(bookingData.bookingDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-3 transition-all duration-700 delay-400 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            to="/events"
            className="flex items-center justify-center px-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className=" bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center"
          >
            Browse More Events
          </Link>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingSuccess;
