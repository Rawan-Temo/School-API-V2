const Student = require("../models/student");
const apiFeatures = require("../utils/apiFeatures");
const User = require("../models/user");

// Get all students with optional filtering, sorting, and pagination
// Get all students with optional filtering, sorting, and pagination
const getAllStudents = async (req, res) => {
  try {
    // Initialize the API features for filtered, sorted, and paginated student data
    const features = new apiFeatures(
      Student.find({ active: true }).populate("classes subjects"), // Fetch classes and subjects data if applicable
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Convert the filtered query into a plain object for counting
    const countFeatures = new apiFeatures(
      Student.find({ active: true }), // Use base Student query for counting
      req.query
    ).filter(); // Only apply filter without sorting, pagination, or field limiting

    // Use `Promise.all` to execute both queries simultaneously
    const [students, numberOfActiveStudents] = await Promise.all([
      features.query, // Get paginated students
      countFeatures.query.countDocuments(), // Count all filtered documents
    ]);

    // Step 3: Send the response with detailed logging for debugging
    res.status(200).json({
      status: "success",
      results: students.length, // Number of students returned in the current query
      numberOfActiveStudents, // Total number of active students matching filters
      data: students, // The actual student data
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ status: "fail", message: error.message }); // Send error response
  }
};
// Get all students with optional filtering, sorting, and pagination
const getAllStudentsWithDetails = async (req, res) => {
  try {
    // Initialize apiFeatures with the Student model query
    const features = new apiFeatures(
      Student.find().populate("classId"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query with all features applied
    const students = await features.query.populate("classId"); // Populate classId to get class details

    res.status(200).json({
      status: "success",
      results: students.length,
      data: students,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Add a new student
const addStudent = async (req, res) => {
  try {
    const existingStudent = await Student.findOne({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      active: true,
    });
    if (existingStudent) {
      res.status(400).json({
        status: "fail",
        message: "student with this name allready exists",
      });
    } else {
      const newStudent = await Student.create(req.body);
      res.status(201).json({
        status: "success",
        data: newStudent,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get a specific student by ID
const getAStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId).populate("classId");

    if (!student) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Update a specific student by ID
const updateStudent = async (req, res) => {
  try {
    // Find the student first to check the current yearLevel
    const studentId = req.params.id;
    const existingStudent = await Student.findById(studentId);
    const existingName = await Student.findOne({
      firstName: existingStudent.firstName,
      middleName: existingStudent.middleName,
      lastName: existingStudent.lastName,
      active: true,
    });
    if (!existingStudent) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }
    if (req.body.active === true && existingName) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student already exisits" });
    }
    const yearLevelUpdated =
      req.body.yearLevel && req.body.yearLevel !== existingStudent.yearLevel;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }
    // Check if the yearLevel has changed
    // If the yearLevel is updated, modify the yearRepeated array
    if (yearLevelUpdated) {
      const currentYearLevel = req.body.yearLevel;

      // Check if the year level already exists in yearRepeated

      const repeatedYear = existingStudent.yearRepeated.find(
        (item) => item.yearLevel === currentYearLevel
      );

      if (!repeatedYear) {
        // If it does not exist, add a new entry with yearCount 1
        updatedStudent.yearRepeated.push({
          yearLevel: currentYearLevel,
          yearCount: 1,
        });
        // Save the updated student back to the database
        await updatedStudent.save();
      }
    }
    res.status(200).json({
      status: "success",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const incrementYear = async (req, res) => {
  try {
    const studentId = req.params.id;
    const yearUpdates = req.body.yearRepeated; // Array of { yearLevel, yearCount }

    if (!Array.isArray(yearUpdates)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input, yearRepeated should be an array.",
      });
    }

    // Step 1: Find the student by ID
    const student = await Student.findById(studentId);

    // Check if the student exists
    if (!student) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    // Step 2: Iterate over the yearRepeated array and update the student's data
    yearUpdates.forEach(({ yearLevel, yearCount }) => {
      // Check if the year level already exists in yearRepeated
      const repeatedYear = student.yearRepeated.find(
        (item) => item.yearLevel === yearLevel
      );

      if (repeatedYear) {
        // If it exists, update the yearCount
        repeatedYear.yearCount = yearCount;
      } else {
        // If it does not exist, add a new entry
        student.yearRepeated.push({
          yearLevel,
          yearCount,
        });
      }
    });

    // Step 3: Save the updated student back to the database
    await student.save();

    // Step 4: Return success response
    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate a specific student by ID
const deactivateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const studentUser = await User.findOne({ profileId: studentId });
    if (studentUser) {
      await User.findByIdAndDelete(studentUser._id);
    }
    const student = await Student.findById(studentId);

    if (!student) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }
    if (!student.active) {
      res.status(200).json({
        status: "success",
        message: "Student Allready deactivated",
        data: null,
      });
    } else {
      student.active = false;
      await student.save();

      res.status(200).json({
        status: "success",
        message: "Student deactivated successfully",
        data: null,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Delete a specific student by ID
// const deleteStudentFinally = async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     const deletedStudent = await Student.findByIdAndDelete(studentId);

//     if (!deletedStudent) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Student not found" });
//     }

//     res.status(204).json({
//       status: "success",
//       message: "Student deleted successfully",
//       data: null,
//     });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };
// Delete multiple students by their IDs
const deActivateManyStudents = async (req, res) => {
  try {
    const studentIds = req.body.ids;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ status: "fail", message: "Invalid input" });
    }

    // Step 1: Soft delete the students by updating the 'active' status
    const result = await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { active: false } } // Set active to false for soft deletion
    );

    // Check if any documents were modified
    if (result.nModified === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No students found or already deactivated.",
      });
    }
    // Step 2: Delete corresponding user accounts for each teacher
    for (const studentId of studentIds) {
      const studentUser = await User.findOne({ profileId: studentId });
      if (studentUser) {
        await User.findByIdAndDelete(studentUser._id);
      }
    }
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      message: "Students deactivated successfully.",
      data: null,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const countData = async (req, res) => {
  try {
    const filter = {};
    filter.active = true;
    req.query.classId && (filter.classId = req.query.classId);

    const numberOfDocuments = await Student.countDocuments(filter);
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfDocuments,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const countGender = async (req, res) => {
  try {
    const counts = await Student.aggregate([
      {
        $match: { active: true }, // Filter only active students
      },
      {
        $group: {
          _id: "$gender", // Group by the gender field
          count: { $sum: 1 }, // Count the number of documents for each gender
        },
      },
    ]);

    // Extract counts from the aggregation result
    const numberOfMaleStudents =
      counts.find((c) => c._id === "Male")?.count || 0;
    const numberOfFemaleStudents =
      counts.find((c) => c._id === "Female")?.count || 0;
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfMaleStudents,
      numberOfFemaleStudents,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const search = async (req, res) => {
  try {
    // Extract search parameters
    const searchText = req.params.id || "";
    const regex = new RegExp(searchText.split("").join(".*"), "i");

    // Base query for direct matching
    let features = new apiFeatures(
      Student.find({
        $or: [{ firstName: regex }, { middleName: regex }, { lastName: regex }],
      })
        .populate("subjects")
        .populate("classes"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query and count matching documents
    let [results, totalResults] = await Promise.all([
      features.query,
      Student.countDocuments({
        $or: [{ firstName: regex }, { middleName: regex }, { lastName: regex }],
        active: true,
      }),
    ]);

    // If no direct matches found, switch to fuzzy search
    if (results.length < 1) {
      features = new apiFeatures(
        Student.fuzzySearch(searchText)
          .populate("subjects")
          .populate("classes"),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      // Execute fuzzy search query and count
      [results, totalResults] = await Promise.all([
        features.query,
        Student.fuzzySearch(searchText).countDocuments({ active: true }),
      ]);
    }

    // Send response with results and total count for pagination
    res.status(200).json({
      status: "success",
      totalResults,
      results: results.length,
      data: results,
    });
  } catch (error) {
    // Log error and send error response
    console.error("Error performing search:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
module.exports = {
  getAllStudents,
  getAllStudentsWithDetails,
  getAStudent,
  addStudent,
  updateStudent,
  deactivateStudent,
  deActivateManyStudents,
  incrementYear,
  countData,
  countGender,
  search,
};
