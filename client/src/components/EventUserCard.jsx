import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventsUserCard = ({event}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <>
      <div
        key={event._id}
        className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group cursor-pointer"
        onClick={handleViewDetails}
      >
        {/* Image */}
        <div className="h-48 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
          {event.img ? (
            <img
              src={event.img}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="text-white text-center p-4">
              <h3 className="text-xl font-bold">{event.title}</h3>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-600">
            Event
          </span>

          <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>

          <p className="text-gray-500 mt-2"> {event.location}</p>

          {/* Date formatted as DD-MM-YYYY */}
          <p className="text-gray-500">
            {new Date(event.date).toLocaleDateString("en-GB")}
          </p>

          {/* Price */}
          <p className="text-gray-600 mt-1">
            Price:{" "}
            <span className="font-semibold text-indigo-600">
              ${event.price}
            </span>
          </p>

          {/* Available Seats */}
          <p className="text-gray-600 mt-1">
            Available Seats:{" "}
            <span className={`font-semibold ${
              event.availableSeats > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {event.availableSeats}
            </span>
          </p>

          {/* CTA */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default EventsUserCard;