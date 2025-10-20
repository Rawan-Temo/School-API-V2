const ClassModel = require("../models/class");
const createController = require("../utils/createControllers");

const classController = createController(Class, "class", "name");
const countData = async (req, res) => {
  try {
    const filter = {};
    filter.active = true;
    req.query.classId && (filter.classId = req.query.classId);
    console.log(filter);

    const numberOfDocuments = await ClassModel.countDocuments(filter);
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfDocuments,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
module.exports = {
  ...classController,
  countData,
};
