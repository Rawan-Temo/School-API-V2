const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    }, // Reference to Student
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // Reference to Course
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Excused", "Late"],
      required: true,
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

// Index to ensure a student can't be marked multiple times for the same Course on the same day
attendanceSchema.index(
  { studentId: 1, courseId: 1, date: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
