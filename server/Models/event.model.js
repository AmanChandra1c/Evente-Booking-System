const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    img: {
      type: String, // image URL or path
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // event must belong to a user (admin/organizer)
    },
  },
  {
    timestamps: true,
  }
);


const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
