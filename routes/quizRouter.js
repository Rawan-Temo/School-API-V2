const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Quiz routes
router
  .route("/")
  .post(quizController.createQuiz)
  .get(quizController.getAllQuizzes);

router
  .route("/:id")
  .get(quizController.getQuizById)
  .patch(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

// // Question routes

router.route("/:quizId/questions").get(quizController.getAllQuestions);

router
  .route("/:quizId/questions/:questionId")
  .get(quizController.getQuestionById)
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
