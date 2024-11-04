const TimeTable = require("../models/timeTable");
const apiFeatures = require("../utils/apiFeatures");
/// Get all timetables
const allTimeTables = async (req, res) => {
  try {
    // Initialize apiFeatures with the date filter
    const features = new apiFeatures(
      TimeTable.find().populate("classId subjectId"),
      req.query
    )
      .sort()
      .filter()
      .limitFields()
      .paginate();

    // Construct a separate query object for counting with filters applied
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "month"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Parse the query string to convert query parameters like gte/gt/lte/lt into MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);

    // Apply the parsed filter to count active documents
    const countQuery = TimeTable.countDocuments(parsedQuery);

    const [timetables, numberOfActiveTimetables] = await Promise.all([
      features.query,
      countQuery.exec(),
    ]);

    res.status(200).json({
      status: "success",
      results: timetables.length,
      numberOfActiveTimetables,
      data: timetables,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const timeResults = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    // Add date range filtering if startDate or endDate is provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Query the TimeTable model with the filter
    const timeResults = await TimeTable.find(filter);

    res.status(200).json({
      status: "success",
      results: timeResults.length,
      data: timeResults,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Get a single timetable by ID
const aTimeTable = async (req, res) => {
  try {
    const timetableId = req.params.id;
    const timetable = await TimeTable.findById(timetableId);

    if (!timetable) {
      return res
        .status(404)
        .json({ status: "fail", message: "TimeTable not found" });
    }

    res.status(200).json({
      status: "success",
      data: timetable,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Add a new timetable
const addTimeTable = async (req, res) => {
  try {
    const newTimeTable = await TimeTable.create(req.body);

    res.status(201).json({
      status: "success",
      data: newTimeTable,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Update an existing timetable by ID
const updateTimeTable = async (req, res) => {
  try {
    const timetableId = req.params.id;
    const updatedTimeTable = await TimeTable.findByIdAndUpdate(
      timetableId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTimeTable) {
      return res
        .status(404)
        .json({ status: "fail", message: "TimeTable not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedTimeTable,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate a specific timetable by ID
const deactivateTimeTable = async (req, res) => {
  try {
    const timetableId = req.params.id;
    const updatedTimeTable = await TimeTable.findByIdAndUpdate(
      timetableId,
      { active: false },
      { new: true }
    );

    if (!updatedTimeTable) {
      return res
        .status(404)
        .json({ status: "fail", message: "TimeTable not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedTimeTable,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate multiple timetables
const deactivateManyTimeTables = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs to deactivate

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid request body" });
    }

    const result = await TimeTable.updateMany(
      { _id: { $in: ids } },
      { active: false }
    );

    res.status(200).json({
      status: "success",
      message: `${result.modifiedCount} TimeTables have been deactivated.`,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await TimeTable.countDocuments({ active: true });
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
  allTimeTables,
  addTimeTable,
  deactivateTimeTable,
  deactivateManyTimeTables,
  aTimeTable,
  updateTimeTable,
  timeResults,
  countData,
};
