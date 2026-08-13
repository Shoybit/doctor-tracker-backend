const express = require("express");

const {
  createPatient,
  getAllPatients,
  getPatientsByDoctor,
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

// Get all patients
router.get("/patients", getAllPatients);

// Get patients by doctor
router.get(
  "/doctors/:doctorId/patients",
  getPatientsByDoctor
);

module.exports = router;