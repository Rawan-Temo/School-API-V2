const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, classController.countData);

router
  .route("/")
  .get(authenticateToken, isStudent, classController.allClasses)
  .post(authenticateToken, isAdmin, classController.addClass);

router
  .route("/deactivateMany")
  .patch(authenticateToken, isAdmin, classController.deactivateManyClasses);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, classController.deactivateClass);

router
  .route("/:id")
  .get(authenticateToken, isStudent, classController.aClass)
  .patch(authenticateToken, isAdmin, classController.updateClass);

module.exports = router;
