const express = require("express");
const router = express.Router();
const examResultController = require("../controllers/examResultController.js");
router.get("/count", examResultController.countData);

router
  .route("/")
  .get(examResultController.allResults)
  .post(examResultController.addResult);

router.route("/deactivate/:id").patch(examResultController.deactivateResult);
router
  .route("/deactivate-many")
  .patch(examResultController.deactivateManyResults);

router
  .route("/:id")
  .get(examResultController.aResult)
  .patch(examResultController.updateResult);

module.exports = router;
