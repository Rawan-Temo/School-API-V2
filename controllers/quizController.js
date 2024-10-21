const Quiz = require("../models/quiz.js");

const getAllQuizzes = async (req, res) => {
  try {
    // Retrieve all quizzes from the database, optionally populate related data
    const quizzes = await Quiz.find().populate({
      path: "questions",
      populate: {
        path: "choices",
      },
    });
    const numberOfQuizes = await Quiz.countDocuments();

    // Respond with the list of quizzes
    res.status(200).json({
      status: "success",
      numberOfQuizes,
      results: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
// Get a quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }
    res.status(200).json({ status: "success", data: quiz });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);

    // Respond with the created quiz
    res.status(201).json({
      status: "success",
      data: newQuiz,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
// Update a quiz by ID
const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedQuiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }
    res.status(200).json({ status: "success", data: updatedQuiz });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Delete a quiz by ID
const deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
//question functions

// Get all questions for a specific quiz by quiz ID
const getAllQuestions = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId).select("questions");

    if (!quiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }

    res.status(200).json({
      status: "success",
      results: quiz.questions.length,
      data: quiz.questions,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }

    const question = quiz.questions.id(questionId);

    if (!question) {
      return res
        .status(404)
        .json({ status: "fail", message: "Question not found" });
    }
    res.status(200).json({
      status: "success",
      data: question,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// // Update a specific question by ID
// const updateQuestion = async (req, res) => {
//   try {
//     const { quizId, questionId } = req.params;
//     const { text, type, choices, correctAnswer } = req.body;

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Quiz not found" });
//     }

//     const question = quiz.questions.id(questionId);
//     if (!question) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Question not found" });
//     }

//     // Update fields
//     if (text) question.text = text;
//     if (type) question.type = type;
//     if (choices) question.choices = choices;
//     if (correctAnswer) question.correctAnswer = correctAnswer;

//     await quiz.save();
//     res.status(200).json({ status: "success", data: question });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };
// // Delete a specific question by ID
// const deleteQuestion = async (req, res) => {
//   try {
//     const { quizId, questionId } = req.params;
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Quiz not found" });
//     }

//     const question = quiz.questions.id(questionId);
//     if (!question) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Question not found" });
//     }

//     // Remove the question
//     question.remove();
//     await quiz.save();

//     res.status(204).json({ status: "success", data: null });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };
module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllQuestions,
  getQuestionById,
//   updateQuestion,
//   deleteQuestion,
};
