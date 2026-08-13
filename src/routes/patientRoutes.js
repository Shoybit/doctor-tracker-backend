const express = require("express");

const {
  createPatient,
  getAllPatients,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
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

// Update patient - Admin only
router.put(
  "/patients/:id",
  protect,
  authorize("admin"),
  updatePatient
);

// Delete patient - Admin only
router.delete(
  "/patients/:id",
  protect,
  authorize("admin"),
  deletePatient
);

module.exports = router;