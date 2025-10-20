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
  .get(authenticateToken, isStudent, examController.getAll)
  .post(authenticateToken, isAdmin, examController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, examController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, examController.deleteMany);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, examController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, examController.getOneById)
  .patch(authenticateToken, isAdmin, examController.updateOne)
  .delete(authenticateToken, isAdmin, examController.deleteOne);

module.exports = router;
