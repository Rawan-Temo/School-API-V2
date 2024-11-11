const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, isStudent, examController.countData);

router
  .route("/")
  .get(authenticateToken, isStudent, examController.allExams)
  .post(authenticateToken, isAdmin, examController.addExam);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, examController.deactivateExam);
router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, examController.deactivateManyExams);

router
  .route("/:id")
  .get(authenticateToken, examController.anExam)
  .patch(authenticateToken, isAdmin, examController.updateExam);

module.exports = router;
