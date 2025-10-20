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
      ref: "Course", // Reference to the Course model
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
