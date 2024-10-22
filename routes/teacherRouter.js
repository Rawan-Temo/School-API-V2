const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController.js");
router.get("/count-students", teacherController.countData);
router.get("/count-gender", teacherController.countGender);

router.route("/details").get(teacherController.getAllTeachersWithDetails);
router.route("/deleteTeachers").patch(teacherController.deActivateManyTeachers);
router
  .route("/")
  .get(teacherController.getAllTeachers)
  .post(teacherController.addTeacher);
// router.route("/delete/:id").delete(teacherController.deActivateManyTeachers);
router.get("/search/:id", teacherController.search);
router.route("/deactivate/:id").patch(teacherController.deactivateTeacher);
router
  .route("/:id")
  .get(teacherController.getATeacher)
  .patch(teacherController.updateTeacher);

module.exports = router;
