const express = require("express");
const router = express.Router();
const timeTableController = require("../controllers/timeTableController.js");
router.get("/count", timeTableController.countData);

router
  .route("/")
  .get(timeTableController.allTimeTables)
  .post(timeTableController.addTimeTable);

router.route("/deactivate/:id").patch(timeTableController.deactivateTimeTable);
router.route("/time-filter").get(timeTableController.timeResults);
router
  .route("/deactivate-many")
  .patch(timeTableController.deactivateManyTimeTables);

router
  .route("/:id")
  .get(timeTableController.aTimeTable)
  .patch(timeTableController.updateTimeTable);

module.exports = router;
