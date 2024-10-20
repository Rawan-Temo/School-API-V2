const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController.js");
router.get("/count", examController.countData);

router.route("/").get(examController.allExams).post(examController.addExam);

router.route("/deactivate/:id").patch(examController.deactivateExam);
router.route("/deactivate-many").patch(examController.deactivateManyExams);

router
  .route("/:id")
  .get(examController.anExam)
  .patch(examController.updateExam);

module.exports = router;
