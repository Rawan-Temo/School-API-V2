const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam", // Reference to the Exam model
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Create the ExamResult model
// Create a compound index to ensure that the combination of student and exam is unique
//Hi
const ExamResult = mongoose.model("ExamResult", examResultSchema);
module.exports = ExamResult;
