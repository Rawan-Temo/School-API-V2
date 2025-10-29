const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
  attachStudentQuery,
} = require("../middlewares/authMiddleware.js");

router
  .route("/")
  .get(authenticateToken, isTeacher, studentController.getAll)
  .post(authenticateToken, isAdmin, studentController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, studentController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, studentController.deleteMany);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, studentController.deactivateOne);
router
  .route("/:id")
  .get(authenticateToken, isStudent, studentController.getOneById)
  .patch(authenticateToken, isAdmin, studentController.updateOne)
  .delete(authenticateToken, isAdmin, studentController.deleteOne);

module.exports = router;
