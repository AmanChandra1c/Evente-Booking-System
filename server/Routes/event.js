const express = require("express");
const {
  create_event,
  get_events,
  get_single_event,
  delete_event,
  update_event,
  get_admin_events,
} = require("../Controllers/event.controller.js");

const authorizeRole = require("../Middleware/authroll.middleware.js");
const { protectedRoute } = require("../Middleware/auth.middleware.js");

const router = express.Router();

router.post(
  "/create-event",
  protectedRoute,
  authorizeRole("admin"),
  create_event
);

router.get("/get-events", get_events);
router.get("/get-events/:id", get_single_event);

router.get(
  "/get-admin-events",
  protectedRoute,
  authorizeRole("admin"),
  get_admin_events
);

router.delete(
  "/delete-event/:id",
  protectedRoute,
  authorizeRole("admin"),
  delete_event
);

router.put(
  "/update-event/:id",
  protectedRoute,
  authorizeRole("admin"),
  update_event
);

module.exports = router;
