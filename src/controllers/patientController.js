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
// Get All Patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Patients by Doctor
const getPatientsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const patients = await Patient.find({
      doctor: doctorId,
    })
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
      },
      patients,
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



module.exports = {
  createPatient,
  getAllPatients,
  getPatientsByDoctor,
};