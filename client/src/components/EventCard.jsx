import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "./ui/Card";
import Button from "./ui/Button";

const EventCard = memo(({ event, handleEdit, handleDelete }) => {
  const formatDateTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const handleEditClick = useCallback(() => {
    handleEdit(event);
  }, [event, handleEdit]);

  const handleDeleteClick = useCallback(() => {
    handleDelete(event._id);
  }, [event._id, handleDelete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card glass className="hover-lift h-full">
        <CardBody className="p-0 h-full flex flex-col">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-5">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm">
              Event
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-2 line-clamp-2">
              {event.title}
            </h3>
          </div>

          {/* Event Details */} 
          <div className="p-4 sm:p-5 flex-1 flex flex-col">
            <div className="space-y-3 sm:space-y-4 mb-4 flex-1">
              <p className="text-slate-300 flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="text-sm sm:text-base truncate">{event.location}</span>
              </p>

              <p className="text-slate-300 flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-xs sm:text-sm">{formatDateTime(event.date)}</span>
              </p>

              <div className="flex justify-between items-center">
                <p className="text-slate-300 flex items-center gap-2">
                  <span className="text-lg">💺</span>
                  <span className="text-xs sm:text-sm">
                    {event.availableSeats} / {event.totalSeats} seats
                  </span>
                </p>
                
                <p className="text-indigo-400 font-bold text-sm sm:text-base">
                  ${event.price}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 mt-auto">
              <Button
                variant="primary"
                onClick={handleEditClick}
                className="flex-1 text-xs sm:text-sm py-2"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                className="flex-1 text-xs sm:text-sm py-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
