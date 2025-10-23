const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }, // Unique email for each teacher
    gender: {
      type: String,
      enum: ["Male", "Female"], // Options for gender
      required: true,
    },
    phoneNumber: {
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

// Create the Teacher model
teacherSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
