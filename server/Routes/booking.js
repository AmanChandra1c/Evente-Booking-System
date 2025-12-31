const express = require("express");
const {
  create_booking,
  get_bookings,
  get_booking,
  cancel_booking,
  delete_booking,
} = require("../Controllers/booking.controller.js");

const { protectedRoute } = require("../Middleware/auth.middleware.js");

const router = express.Router();

router.post("/", protectedRoute, create_booking);
router.get("/", protectedRoute, get_bookings);
router.get("/:id", protectedRoute, get_booking);
router.put("/:id/cancel", protectedRoute, cancel_booking);
router.delete("/:id", protectedRoute, delete_booking);

module.exports = router;