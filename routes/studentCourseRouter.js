const express = require("express");

const router = express.Router();

const studentCourseController = require("../controllers/studentCourseController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");

router
  .route("/")
  .get(authenticateToken, isStudent, studentCourseController.getAll)
  .post(authenticateToken, isAdmin, studentCourseController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, studentCourseController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, studentCourseController.deleteMany);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, studentCourseController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, studentCourseController.getOneById)
  .patch(authenticateToken, isAdmin, studentCourseController.updateOne)
  .delete(authenticateToken, isAdmin, studentCourseController.deleteOne);

module.exports = router;
