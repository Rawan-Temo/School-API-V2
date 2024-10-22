const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController.js");
router.get("/search/:id", subjectController.search);
router.get("/count", subjectController.countData);

router
  .route("/")
  .get(subjectController.AllSubjects)
  .post(subjectController.addSubject);
router.route("/deactivate/:id").patch(subjectController.deactivateSubject);
router
  .route("/:id")
  .get(subjectController.getASubject)
  .patch(subjectController.updateSubject);
// router.route("/delete/:id").delete(subjectController.deleteFinall)
module.exports = router;
