import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from './ui/Card';
import Button from './ui/Button';

const EventsUserCard = ({event}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card glass className="hover-lift cursor-pointer group w-full" onClick={handleViewDetails}>
      <CardBody className="p-0 h-full flex flex-col">
        {/* Image */}
        <div className="h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
          {event.img ? (
            <img
              src={event.img}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="text-white text-center p-3 sm:p-4">
              <h3 className="text-lg sm:text-xl font-bold line-clamp-2">{event.title}</h3>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Event
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px]">{event.location}</span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
            {event.title}
          </h2>

          <div className="space-y-2 sm:space-y-3 mb-4 flex-1">
            <div className="flex items-center gap-2 text-slate-300">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-green-400">
                ${event.price}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className={`text-xs sm:text-sm font-semibold ${
                event.availableSeats > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {event.availableSeats} seats
              </span>
            </div>
          </div>

          {/* CTA */}
          <Button 
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
          >
            View Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventsUserCard;