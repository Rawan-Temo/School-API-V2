const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true,
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
  }, // Required for true/false questions
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
