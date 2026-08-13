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
// Get All Patients with Search & Filters
// Get All Patients with Search, Filters & Pagination
const getAllPatients = async (req, res) => {
  try {
    const {
      search,
      condition,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by name, email or phone
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by condition
    if (condition) {
      query.condition = {
        $regex: condition,
        $options: "i",
      };
    }

    // Filter by registered date
    if (startDate || endDate) {
      query.registeredAt = {};

      if (startDate) {
        query.registeredAt.$gte = new Date(
          `${startDate}T00:00:00.000Z`
        );
      }

      if (endDate) {
        query.registeredAt.$lte = new Date(
          `${endDate}T23:59:59.999Z`
        );
      }
    }

    // Pagination
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.max(parseInt(limit) || 10, 1);
    const skip = (currentPage - 1) * itemsPerPage;

    // Total patients
    const totalPatients = await Patient.countDocuments(query);

    // Get patients
    const patients = await Patient.find(query)
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    const totalPages = Math.ceil(
      totalPatients / itemsPerPage
    );

    return res.status(200).json({
      success: true,
      count: patients.length,
      pagination: {
        currentPage,
        limit: itemsPerPage,
        totalPatients,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
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

// Update Patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const allowedFields = [
      "name",
      "age",
      "gender",
      "phone",
      "email",
      "condition",
      "registeredAt",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const patient = await Patient.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "doctor",
      "name specialization department"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete Patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);

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
  updatePatient,
  deletePatient,
};