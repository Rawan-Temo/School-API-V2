const express = require("express");
const router = express.Router();
const timeTableController = require("../controllers/timeTableController.js");
const {
  authenticateToken,
  isAdmin,
  isStudent,
} = require("../middlewares/authMiddleware.js");

router
  .route("/")
  .get(authenticateToken, isStudent, timeTableController.getAll)
  .post(authenticateToken, isAdmin, timeTableController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, timeTableController.deactivateMany);
router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, timeTableController.deleteMany);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, timeTableController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, isStudent, timeTableController.getOneById)
  .patch(authenticateToken, isAdmin, timeTableController.updateOne)
  .delete(authenticateToken, isAdmin, timeTableController.deleteOne);

module.exports = router;
