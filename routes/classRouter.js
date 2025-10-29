const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController.js");
const {
  authenticateToken,
  isAdmin,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, classController.countData);

router
  .route("/")
  .get(authenticateToken, isStudent, classController.getAll)
  .post(authenticateToken, isAdmin, classController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, classController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, classController.deleteMany);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, classController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, isStudent, classController.getOneById)
  .patch(authenticateToken, isAdmin, classController.updateOne)
  .delete(authenticateToken, isAdmin, classController.deleteOne);

module.exports = router;
