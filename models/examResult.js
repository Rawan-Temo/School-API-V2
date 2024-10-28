const mongoose = require("mongoose");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");
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
  studentName: {
    type: String, // Denormalized field for fuzzy search
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
// Apply fuzzy searching plugin
examResultSchema.plugin(mongooseFuzzySearching, { fields: ["studentName"] });
const ExamResult = mongoose.model("ExamResult", examResultSchema);
module.exports = ExamResult;
