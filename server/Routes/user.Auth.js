const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  checkAuth,
} = require("../Controllers/auth.controller.js");
const { protectedRoute } = require("../Middleware/auth.middleware.js");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/checkauth", protectedRoute, checkAuth);

module.exports = router;
