const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const { countDocuments } = require("../utils/countDocs.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, isAdmin, countDocuments);

router
  .route("/")
  .get(authenticateToken, isAdmin, adminController.getAll)
  .post(authenticateToken, isAdmin, adminController.createOne);

router
  .route("/deactivate-many")
  .patch(authenticateToken, isAdmin, adminController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, adminController.deleteMany);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, adminController.deactivateOne);

router
  .route("/:id")
  .get(authenticateToken, isAdmin, adminController.getOneById)
  .patch(authenticateToken, isAdmin, adminController.updateOne)
  .delete(authenticateToken, isAdmin, adminController.deleteOne);
module.exports = router;
