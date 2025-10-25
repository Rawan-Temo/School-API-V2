const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema(
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
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Dropped"],
    },
  },
  { timestamps: true }
);

const StudentCourse = mongoose.model("StudentCourse", studentCourseSchema);
module.exports = StudentCourse;
