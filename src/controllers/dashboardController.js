const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// Get Dashboard Analytics
const getDashboardStats = async (req, res) => {
  try {
    // Get selected range
    const { range = "week" } = req.query;

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    if (range === "week") {
      startDate.setDate(now.getDate() - 6);
    } else if (range === "month") {
      startDate.setDate(now.getDate() - 29);
    } else if (range === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid range. Use week, month, or year",
      });
    }

    // Total doctors
    const totalDoctors = await Doctor.countDocuments();

    // Total patients
    const totalPatients = await Patient.countDocuments();

    // Patients per doctor
    const patientsPerDoctor = await Patient.aggregate([
      {
        $group: {
          _id: "$doctor",
          totalPatients: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: {
          path: "$doctor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          doctorId: "$_id",
          doctorName: "$doctor.name",
          specialization: "$doctor.specialization",
          totalPatients: 1,
        },
      },
      {
        $sort: {
          totalPatients: -1,
        },
      },
    ]);

    // Patients by registration date
    const patientsByDate = await Patient.aggregate([
      {
        $match: {
          registeredAt: {
            $gte: startDate,
            $lte: now,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$registeredAt",
            },
          },
          totalPatients: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalPatients: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      range,
      stats: {
        totalDoctors,
        totalPatients,
        patientsPerDoctor,
        patientsByDate,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardStats,
};