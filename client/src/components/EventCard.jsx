import React from "react";

const EventCard = ({ event, handleEdit, handleDelete }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm">
          Event
        </span>
        <h3 className="text-lg font-bold text-white mt-2">{event.title}</h3>
      </div>

      {/* Event Details */} 
      <div className="p-5">
        <div className="space-y-3 mb-4">
          <p className="text-gray-600 flex items-center gap-2">
            <span>📍</span>
            <span className="text-sm">{event.location}</span>
          </p>

          <p className="text-gray-600 flex items-center gap-2">
            <span>📅</span>
            <span className="text-sm">{formatDateTime(event.date)}</span>
          </p>

          <div className="flex justify-between items-center">
            <p className="text-gray-600 flex items-center gap-2">
              <span>💺</span>
              <span className="text-sm">
                {event.availableSeats} / {event.totalSeats} seats
              </span>
            </p>
            
            <p className="text-indigo-600 font-bold">
              ${event.price}
            </p>
          </div>
        </div>

        {/* Description Preview */}
        {event.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(event)}
            className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-lg hover:bg-yellow-200 transition-colors font-medium text-sm"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => handleDelete(event._id)}
            className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
