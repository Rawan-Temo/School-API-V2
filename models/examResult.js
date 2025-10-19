const mongoose = require("mongoose");
const examResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
      required: true,
    },
    type: {
      type: String,
      enum: ["Exam", "Quiz"],
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type", // Reference to the Exam model
      required: true,
    },
    studentName: {
      type: String, // Denormalized field for fuzzy search
    },
    score: {
      type: Number,
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

// Create the ExamResult model
// Create a compound index to ensure that the combination of student and exam is unique
examResultSchema.index({ student: 1, exam: 1 }, { unique: true });

const ExamResult = mongoose.model("ExamResult", examResultSchema);
module.exports = ExamResult;
