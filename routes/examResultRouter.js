const express = require("express");
const router = express.Router();
const examResultController = require("../controllers/examResultController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  attachStudentQuery,
} = require("../middlewares/authMiddleware.js");
router.get("/count", examResultController.countData);

router
  .route("/")
  .get(authenticateToken, attachStudentQuery, examResultController.getAll)
  .post(authenticateToken, isTeacher, examResultController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, examResultController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, examResultController.deleteMany);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, examResultController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, examResultController.oneResult)
  .patch(authenticateToken, isTeacher, examResultController.updateOne)
  .delete(authenticateToken, isAdmin, examResultController.deleteOne);

module.exports = router;
