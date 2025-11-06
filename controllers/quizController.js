const Quiz = require("../models/quiz.js");
const Course = require("../models/course.js");

const apiFeatures = require("../utils/apiFeatures");
const ExamResult = require("../models/examResult.js");
const { extname } = require("path/win32");
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

    const countFeatures = new apiFeatures(
      Quiz.find().lean(),
      req.query
    ).filter();
    let [quizzes, numberOfQuizzes] = await Promise.all([
      features.query, // Get paginated quizzes
      countFeatures.query.countDocuments(), // Count all filtered documents
    ]);
    quizzes = quizzes.map((q) => q.toObject());

    if (req.user.role === "Student") {
      quizzes.forEach((quiz) => {
        quiz.questions?.forEach((q) => {
          if (q.type === "true-false") {
            q.correctAnswer = null;
          } else {
            q.choices?.forEach((choice) => {
              choice.isCorrect = null;
            });
          }
        });
      });
    }

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
    const quiz = await Quiz.findById(req.params.id).populate("courseId").lean();
    if (req.user.role === "Student") {
      quiz.questions?.forEach((q) => {
        if (q.type === "true-false") {
          q.correctAnswer = null;
        } else {
          q.choices?.forEach((choice) => {
            choice.isCorrect = null;
          });
        }
      });
    }
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

const submitQuiz = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({
        status: "fail",
        message: "Only students can submit a quiz",
      });
    }

    const { studentAnswers, quizId } = req.body;
    const studentId = req.user.profileId;

    if (!quizId || !Array.isArray(studentAnswers)) {
      return res.status(400).json({
        status: "fail",
        message: "quizId and studentAnswers are required",
      });
    }

    const quiz = await Quiz.findById(quizId).populate("courseId").lean();
    if (!quiz) {
      return res
        .status(404)
        .json({ status: "fail", message: "Quiz not found" });
    }

    const existingSubmission = await ExamResult.findOne({
      examId: quizId,
      studentId,
    });
    if (existingSubmission) {
      return res.status(400).json({
        status: "fail",
        message: "You have already submitted this quiz",
        examResult: existingSubmission,
        note: "You Think You Are Smart Get Gud",
      });
    }

    const ids = studentAnswers.map((a) => String(a.questionId));
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      return res.status(400).json({
        status: "fail",
        message: "Multiple answers per question are not allowed ",
        note: "You Think You Are Smart Get Gud",
      });
    }

    const validQuestionIds = new Set(quiz.questions.map((q) => String(q._id)));
    for (const qId of uniqueIds) {
      if (!validQuestionIds.has(qId)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid question submitted",
        });
      }
    }

    const studentMap = new Map();
    for (const ans of studentAnswers) {
      studentMap.set(String(ans.questionId), String(ans.answer));
    }

    let correctCount = 0;
    for (const q of quiz.questions) {
      const studentAnswer = studentMap.get(String(q._id));
      if (studentAnswer == null) continue;

      let correctAnswer;
      if (q.type === "true-false") {
        correctAnswer = String(q.correctAnswer);
      } else {
        const correctChoice = q.choices?.find((c) => c.isCorrect);
        if (!correctChoice) continue;
        correctAnswer = String(correctChoice.text);
      }

      if (studentAnswer === correctAnswer) correctCount++;
    }

    const totalQuestions = quiz.questions.length;
    const score = (quiz.totalMarks * correctCount) / totalQuestions;

    // Store result
    const examResult = await ExamResult.create({
      examId: quizId,
      studentId,
      score,
      type: "Quiz",
    });

    res.status(200).json({
      status: "success",
      message: `Quiz submitted successfully. Score: ${score} / ${quiz.totalMarks}`,
      data: examResult,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "fail", message: error.message });
  }
};
module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  submitQuiz,
  deleteQuiz,
  getAllQuestions,
  getQuestionById,
};
