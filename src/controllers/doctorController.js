const Doctor = require("../models/Doctor");

// Create Doctor
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      department,
      experience,
      qualification,
      consultationFee,
      bio,
      image,
    } = req.body;

    if (!name || !email || !specialization || !department) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, specialization and department are required",
      });
    }

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      department,
      experience,
      qualification,
      consultationFee,
      bio,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get All Doctors with Search, Filter & Pagination
const getAllDoctors = async (req, res) => {
  try {
    const {
      search,
      specialization,
      department,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isActive: true,
    };

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

    // Filter by specialization
    if (specialization) {
      query.specialization = {
        $regex: specialization,
        $options: "i",
      };
    }

    // Filter by department
    if (department) {
      query.department = {
        $regex: department,
        $options: "i",
      };
    }

    // Pagination
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.max(parseInt(limit) || 10, 1);
    const skip = (currentPage - 1) * itemsPerPage;

    // Total doctors
    const totalDoctors = await Doctor.countDocuments(query);

    // Get doctors
    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    const totalPages = Math.ceil(
      totalDoctors / itemsPerPage
    );

    return res.status(200).json({
      success: true,
      count: doctors.length,
      pagination: {
        currentPage,
        limit: itemsPerPage,
        totalDoctors,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Single Doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update Doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "email",
      "phone",
      "specialization",
      "department",
      "experience",
      "qualification",
      "consultationFee",
      "bio",
      "image",
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

    if (updates.email) {
      const existingDoctor = await Doctor.findOne({
        email: updates.email,
        _id: { $ne: id },
      });

      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message: "Doctor with this email already exists",
        });
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Update doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Deactivate Doctor
const deactivateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor deactivated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Deactivate doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Export all controllers
module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deactivateDoctor,
};