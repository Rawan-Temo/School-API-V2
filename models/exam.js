const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // Reference to the Subject model
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Reference to the Class model
  },
  yearLevel: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year levels from 1 to 12
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
// Composite unique index on date, classId, and yearLevel to prevent overlapping exams
// Optional: Middleware to update the updatedAt field
examSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
