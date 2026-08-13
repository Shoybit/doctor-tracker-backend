const mongoose = require("mongoose");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const createPatient = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const {
      name,
      age,
      gender,
      phone,
      email,
      condition,
      registeredAt,
    } = req.body;

    // Validate doctor ID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    // Required fields
    if (!name || !condition) {
      return res.status(400).json({
        success: false,
        message: "Name and condition are required",
      });
    }

    // Check doctor
    const doctor = await Doctor.findOne({
      _id: doctorId,
      isActive: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or inactive",
      });
    }

    // Create patient
    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      email,
      condition,
      doctor: doctorId,
      registeredAt: registeredAt || Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: "Patient added successfully",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPatient,
};