const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // Reference to the Class model
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course model
    },
    dayOfWeek: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ], // Days of the week
      required: true,
    },
    startTime: {
      type: String, // e.g., "09:00"
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

// Create a unique partial index on active timetables
timetableSchema.index(
  { classId: 1, courseId: 1, dayOfWeek: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;
