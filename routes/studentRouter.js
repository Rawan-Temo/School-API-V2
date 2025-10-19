const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count-students", authenticateToken, studentController.countData);
router.get("/count-gender", authenticateToken, studentController.countGender);

router
  .route("/details")
  .get(
    authenticateToken,
    isTeacher,
    studentController.getAllStudentsWithDetails
  );
router
  .route("/deleteStudents")
  .patch(authenticateToken, isAdmin, studentController.deActivateManyStudents);
router
  .route("/")
  .get(authenticateToken, isTeacher, studentController.getAllStudents)
  .post(authenticateToken, isAdmin, studentController.addStudent);
// router.route("/delete/:id").delete(studentController.deleteStudentFinally);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, studentController.deactivateStudent);
router
  .route("/increment-year/:id")
  .patch(authenticateToken, isAdmin, studentController.incrementYear);
router
  .route("/:id")
  .get(authenticateToken, isStudent, studentController.getAStudent)
  .patch(authenticateToken, isAdmin, studentController.updateStudent);

module.exports = router;
