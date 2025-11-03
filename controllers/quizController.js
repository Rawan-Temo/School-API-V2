const Quiz = require("../models/quiz.js");
const Course = require("../models/course.js");

const apiFeatures = require("../utils/apiFeatures");
//TODO fix and test the new logic of quizzes
const getAllQuizzes = async (req, res) => {
  try {
    // Initialize the API features for filtered, sorted, and paginated quiz data
    const features = new apiFeatures(
      Quiz.find()
        .populate({
          path: "questions",
          populate: { path: "choices" },
        })
        .populate("courseId"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Initialize a separate feature for counting quizzes with only filtering
    const countFeatures = new apiFeatures(Quiz.find(), req.query).filter();

    // Execute both queries in parallel
    const [quizzes, numberOfQuizzes] = await Promise.all([
      features.query, // Get paginated quizzes
      countFeatures.query.countDocuments(), // Count all filtered documents
    ]);

    // Send the response
    res.status(200).json({
      status: "success",
      results: quizzes.length,
      numberOfQuizzes,
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
// Get a quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "classId courseId"
    );
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
    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;
      const courseId = req.body.courseId;

      if (!courseId) {
        return res
          .status(400)
          .json({ message: "courseId is required for teachers" });
      }

      const course = await Course.findOne({ _id: courseId, teacherId });
      if (!course)
        return res
          .status(404)
          .json({ message: "not allowed or Course not found" });
    }
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
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;
      const originalCourse = await Course.findOne({
        _id: quiz.courseId,
        teacherId,
      });

      if (!originalCourse) {
        return res.status(403).json({ message: "Not allowed" });
      }
      if (req.body?.courseId) {
        const newCourse = await Course.findOne({
          _id: req.body.courseId,
          teacherId,
        });
        if (!newCourse) {
          return res
            .status(403)
            .json({ message: "Not allowed to move quiz to this course" });
        }
      }
    }

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
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }

    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;
      const courseId = quiz.courseId;

      const course = await Course.findOne({ _id: courseId, teacherId });

      if (!course) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({
      status: "success",
      message: "Quiz deleted successfully",
    });
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
