const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count-teachers", authenticateToken, teacherController.countData);
router.get("/count-gender", authenticateToken, teacherController.countGender);

router
  .route("/details")
  .get(
    authenticateToken,
    isTeacher,
    teacherController.getAllTeachersWithDetails
  );
router
  .route("/deleteTeachers")
  .patch(authenticateToken, isAdmin, teacherController.deActivateManyTeachers);
router
  .route("/")
  .get(authenticateToken, isTeacher, teacherController.getAllTeachers)
  .post(authenticateToken, isAdmin, teacherController.addTeacher);
// router.route("/delete/:id").delete(teacherController.deActivateManyTeachers);
router.get("/search/:id", authenticateToken, teacherController.search);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, teacherController.deactivateTeacher);
router
  .route("/:id")
  .get(authenticateToken, isTeacher, teacherController.getATeacher)
  .patch(authenticateToken, isAdmin, teacherController.updateTeacher);

module.exports = router;
