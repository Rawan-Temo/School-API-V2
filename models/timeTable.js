const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Reference to the Class model
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // Reference to the Subject model
  },
  teacher: {
    type: mongoose.Schema.Types.Mixed, // This allows for both ObjectId and string
    ref: "Teacher", // Reference to Teacher model
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
  dayOfWeek: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Days of the week
    required: true,
  },
  startTime: {
    type: String, // e.g., "09:00"
    required: true,
  },
  endTime: {
    type: String, // e.g., "10:00"
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Create a unique partial index on active timetables
timetableSchema.index(
  { class: 1, subject: 1, dayOfWeek: 1, startTime: 1, date: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;
