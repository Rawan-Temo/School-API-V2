const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController.js");
router.get("/count", classController.countData);

router
  .route("/")
  .get(classController.allClasses)
  .post(classController.addClass);

router.route("/deactivate/:id").patch(classController.deactivateClass);

router
  .route("/:id")
  .get(classController.aClass)
  .patch(classController.updateClass);

module.exports = router;
