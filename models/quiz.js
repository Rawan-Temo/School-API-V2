const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false"],
    required: true,
  },
  choices: [choiceSchema], // Array of choices for multiple-choice questions
  correctAnswer: {
    type: String,
    required: function () {
      return this.type === "true-false";
    },
  },
  // Required for true/false questions
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Class model
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    description: { type: String },
    questions: [questionSchema],
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 100,
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

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
