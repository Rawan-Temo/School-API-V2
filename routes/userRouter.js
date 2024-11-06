const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
const userController = require("../controllers/userController.js");
router.get("/count", userController.countData);
router
  .route("/profile")
  .get(authenticateToken,userController.userProfile);
router.route("/login").post(userController.login);
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getAUser)
  .delete(userController.deleteAUser);
module.exports = router;
