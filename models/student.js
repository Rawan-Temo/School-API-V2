const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true, // Fixed the typo from requried to required
    },
    lastName: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"], // Options for gender
      required: true,
    },
    address: {
      type: String,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now, // Automatically set to current date
    },
    guardianName: {
      type: String,
    },
    guardianPhone: {
      type: String,
    },
    guardianRelationship: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add compound index for common query patterns
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
