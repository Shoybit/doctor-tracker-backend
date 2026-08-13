const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// CORS
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://doctor-tracke-8qptzwyk-shoyaib-s-projects.vercel.app",
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Doctor Tracker API is running",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;