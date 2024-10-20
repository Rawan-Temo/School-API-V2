const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
router.get("/count", adminController.countData);

router
  .route("/")
  .get(adminController.getAllAdmins)
  .post(adminController.addAdmin);
// router.route("/delete/:id").delete(studentController.deleteStudentFinally);
router.route("/deactivate/:id").patch(adminController.deactivateAdmin);

router
  .route("/:id")
  .get(adminController.getAnAdmin)
  .patch(adminController.updateAdmin);
module.exports = router;
