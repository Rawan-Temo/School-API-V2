const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController.js");
router.get("/count-students", studentController.countData);
router.get("/count-gender", studentController.countGender);

router.route("/details").get(studentController.getAllStudentsWithDetails);
router.route("/deleteStudents").patch(studentController.deActivateManyStudents);
router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.addStudent);
// router.route("/delete/:id").delete(studentController.deleteStudentFinally);
router.route("/deactivate/:id").patch(studentController.deactivateStudent);
router.route("/increment-year/:id").patch(studentController.incrementYear);
router
  .route("/:id")
  .get(studentController.getAStudent)
  .patch(studentController.updateStudent);

module.exports = router;
