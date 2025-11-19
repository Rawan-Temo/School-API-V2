const express = require("express");

const router = express.Router();

const studentCourseController = require("../controllers/studentCourseController.js");
const {
  authenticateToken,
  isAdmin,
  isStudent,
  attachStudentQuery,
} = require("../middlewares/authMiddleware.js");

router
  .route("/")
  .get(
    authenticateToken,
    isStudent,
    attachStudentQuery,
    studentCourseController.getAll
  )
  .post(authenticateToken, isAdmin, studentCourseController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, studentCourseController.deactivateMany);

router
  .route("/create-many")
  .post(authenticateToken, isAdmin, studentCourseController.createMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, studentCourseController.deleteMany);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, studentCourseController.deactivateOne);

router
  .route("/:id")
  .get(
    authenticateToken,
    isStudent,
    attachStudentQuery,
    studentCourseController.getOneById
  )
  .patch(authenticateToken, isAdmin, studentCourseController.updateOne)
  .delete(authenticateToken, isAdmin, studentCourseController.deleteOne);

module.exports = router;
