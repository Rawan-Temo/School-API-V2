const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
// Quiz routes
router
  .route("/")
  .post(authenticateToken, isAdmin, quizController.createQuiz)
  .get(authenticateToken, isStudent, quizController.getAllQuizzes);

router
  .route("/:id")
  .get(authenticateToken, isStudent, quizController.getQuizById)
  .patch(authenticateToken, isAdmin, quizController.updateQuiz);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, quizController.deactivateQuiz);
// // Question routes

router
  .route("/:quizId/questions")
  .get(authenticateToken, isStudent, quizController.getAllQuestions);

router
  .route("/:quizId/questions/:questionId")
  .get(authenticateToken, isStudent, quizController.getQuestionById);
//   .patch(quizController.updateQuestion)
//   .delete(quizController.deleteQuestion);

// // Choice routes
// router.route("/choices")
//   .post(choiceController.createChoice)
//   .get(choiceController.getAllChoices);

// router.route("/choices/:id")
//   .get(choiceController.getChoiceById)
//   .patch(choiceController.updateChoice)
//   .delete(choiceController.deleteChoice);

module.exports = router;
