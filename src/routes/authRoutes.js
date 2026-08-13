const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  adminTest,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logoutUser);

// Admin-only 
router.get("/admin-test", protect, authorize("admin"), adminTest);

module.exports = router;