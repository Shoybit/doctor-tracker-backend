const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://doctor-tracke-two.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

// Doctor routes
app.use("/api/doctors", doctorRoutes);

// Patient routes
app.use("/api", patientRoutes);

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;