const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");

router
  .route("/")
  .get(authenticateToken, isTeacher, teacherController.getAll)
  .post(authenticateToken, isAdmin, teacherController.createOne);
// router.route("/delete/:id").delete(teacherController.deActivateManyTeachers);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, teacherController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, teacherController.deleteMany);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, teacherController.deactivateOne);
router
  .route("/:id")
  .get(authenticateToken, isTeacher, teacherController.getOneById)
  .patch(authenticateToken, isAdmin, teacherController.updateOne)
  .delete(authenticateToken, isAdmin, teacherController.deleteOne);

module.exports = router;
