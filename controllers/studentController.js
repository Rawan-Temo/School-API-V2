const Student = require("../models/student");
const createController = require("../utils/createControllers");

const studentController = createController(Student, "student", ["firstName" , "middleName", "lastName"]);

module.exports = { ...studentController };
