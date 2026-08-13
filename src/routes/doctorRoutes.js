const express = require("express");

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deactivateDoctor,
} = require("../controllers/doctorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createDoctor
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateDoctor
);

router.patch(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateDoctor
);

module.exports = router;