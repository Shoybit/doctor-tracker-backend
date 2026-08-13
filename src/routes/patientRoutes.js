const express = require("express");

const {
  createPatient,
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Add patient under a specific doctor
router.post(
  "/doctors/:doctorId/patients",
  protect,
  authorize("admin"),
  createPatient
);

module.exports = router;