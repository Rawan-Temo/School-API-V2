const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  }, // Reference to Student
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  }, // Reference to Classroom
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  comments: { type: String },
});

// Index to ensure a student can't be marked multiple times for the same subject/class on the same day
attendanceSchema.index(
  { studentId: 1, classId: 1, subjectId: 1, date: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
