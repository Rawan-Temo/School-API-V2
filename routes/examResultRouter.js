const express = require("express");
const router = express.Router();
const examResultController = require("../controllers/examResultController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get("/count", examResultController.countData);

router
  .route("/")
  .get(authenticateToken, examResultController.allResults)
  .post(authenticateToken, examResultController.addResult);
router
  .route("/deactivate-many")
  .patch(
    authenticateToken,
    isAdmin,
    examResultController.deactivateManyResults
  );

router
  .route("/details/:id")
  .get(authenticateToken, isStudent, examResultController.detailedResults);

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, examResultController.deactivateResult);

router
  .route("/:id")
  .get(authenticateToken, isAdmin, examResultController.aResult)
  .patch(authenticateToken, isAdmin, examResultController.updateResult);

module.exports = router;
