const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, courseController.countData);

router
  .route("/")
  .get(authenticateToken, isStudent, courseController.getAll)
  .post(authenticateToken, isAdmin, courseController.createOne);
router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, courseController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, courseController.deleteMany);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, courseController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, isStudent, courseController.getOneById)
  .patch(authenticateToken, isAdmin, courseController.updateOne)
  .delete(authenticateToken, isAdmin, courseController.deleteOne);

module.exports = router;
