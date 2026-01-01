const Booking = require("../Models/booking.model.js");
const Event = require("../Models/event.model.js");

/* ================= CREATE BOOKING ================= */
const create_booking = async (req, res) => {
  try {
    const { eventId, name, email, mobile, quantity } = req.body;

    // Validation
    if (!eventId || !name || !email || !mobile || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (mobile.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be at least 10 digits",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.availableSeats} seats available`,
      });
    }

    const totalAmount = quantity * event.price;

    const booking = await Booking.create({
      eventId,
      userId: req.user._id,
      name,
      email,
      mobile,
      quantity,
      totalAmount,
    });

    // Reduce seats
    event.availableSeats -= quantity;
    await event.save();

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      data: {
        ...booking.toObject(),
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
      },
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during booking",
    });
  }
};

/* ================= GET ALL BOOKINGS ================= */
const get_bookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("eventId", "title location date price img")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
    });
  }
};

/* ================= GET SINGLE BOOKING ================= */
const get_booking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("eventId", "title location date price img")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only owner can view
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(400).json({
      success: false,
      message: "Invalid booking ID or server error",
    });
  }
};

/* ================= CANCEL BOOKING ================= */
const cancel_booking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    // Restore seats
    const event = await Event.findById(booking.eventId);
    if (event) {
      event.availableSeats += booking.quantity;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
    });
  }
};

module.exports = {
  create_booking,
  get_bookings,
  get_booking,
  cancel_booking,
};
