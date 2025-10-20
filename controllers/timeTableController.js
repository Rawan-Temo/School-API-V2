const TimeTable = require("../models/timeTable");
const createController = require("../utils/createControllers");

const timeTableController = createController(TimeTable, "timeTable", "", [
  "courseId",
  "classId",
]);
/// Get all timetables

module.exports = timeTableController;
