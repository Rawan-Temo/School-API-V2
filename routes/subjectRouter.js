const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, subjectController.countData);

router
  .route("/")
  .get(authenticateToken, isStudent, subjectController.AllSubjects)
  .post(authenticateToken, isAdmin, subjectController.addSubject);
router
  .route("/deactivateMany")
  .patch(authenticateToken, isAdmin, subjectController.deactivateManySubject);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, subjectController.deactivateSubject);
router
  .route("/:id")
  .get(authenticateToken, isStudent, subjectController.getASubject)
  .patch(authenticateToken, isAdmin, subjectController.updateSubject);
// router.route("/delete/:id").delete(subjectController.deleteFinall)
module.exports = router;
