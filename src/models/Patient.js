const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    condition: {
      type: String,
      required: true,
      trim: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ condition: 1 });
patientSchema.index({ doctor: 1, registeredAt: -1 });

patientSchema.index({ name: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ registeredAt: -1 });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;