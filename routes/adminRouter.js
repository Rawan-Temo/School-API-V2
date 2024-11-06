const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", authenticateToken, isAdmin, adminController.countData);

router
  .route("/")
  .get(authenticateToken, isAdmin, adminController.getAllAdmins)
  .post(authenticateToken, isAdmin, adminController.addAdmin);
// router.route("/delete/:id").delete(studentController.deleteStudentFinally);
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, adminController.deactivateAdmin);

router
  .route("/:id")
  .get(authenticateToken, isAdmin, adminController.getAnAdmin)
  .patch(authenticateToken, isAdmin, adminController.updateAdmin);
module.exports = router;
