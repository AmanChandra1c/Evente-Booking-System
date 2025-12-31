const Event = require("../Models/event.model.js");

// ================= CREATE EVENT =================
const create_event = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      totalSeats,
      availableSeats,
      price,
      img,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      date,
      totalSeats,
      availableSeats:totalSeats,
      price,
      img,
      userId: req.user._id, // creator
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ================= GET ALL EVENTS =================
const get_events = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events, // ✅ frontend-friendly
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE EVENT =================
const get_single_event = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ADMIN EVENTS =================
const get_admin_events = async (req, res) => {
  
  try {
    // only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const events = await Event.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= UPDATE EVENT =================
const update_event = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // Only creator can update
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ================= DELETE EVENT =================
const delete_event = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // Only creator can delete
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  create_event,
  get_events,
  get_single_event,
  get_admin_events,
  delete_event,
  update_event,
};
