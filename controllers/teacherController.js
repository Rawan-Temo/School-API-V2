const Teacher = require("../models/teacher");
const createController = require("../utils/createControllers");

const teacherController = createController(Teacher, "teacher", [
  "firstName",
  "middleName",
  "lastName",
]);

module.exports = teacherController;
