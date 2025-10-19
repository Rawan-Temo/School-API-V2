const Admin = require("../models/admin");
const apiFeatures = require("../utils/apiFeatures");
const User = require("../models/user");
const createController = require("../utils/createControllers");
// Get all admin s
const adminController = createController(Admin, "Admin", ["name", "email"]);

const getAllAdmins = async (req, res) => {
  try {
    const features = new apiFeatures(Admin.find(), req.query)
      .sort()
      .filter()
      .limitFields()
      .paginate();

    const admins = await features.query;
    const numberOfAdmins = await Admin.countDocuments({ active: true });

    res.status(200).json({
      status: "success",
      numberOfAdmins,
      results: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Add a new admin
const addAdmin = async (req, res) => {
  try {
    const newAdmin = await Admin.create(req.body);

    res.status(201).json({
      status: "success",
      data: newAdmin,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get a specific admin by ID
const getAnAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        status: "fail",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Update an admin
const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        status: "fail",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate an admin
const deactivateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const adminUser = await User.findOne({ profileId: adminId });
    if (adminUser) {
      await User.findByIdAndDelete(adminUser._id);
    }
    const deactivatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { active: false },
      { new: true }
    );

    if (!deactivatedAdmin) {
      return res.status(404).json({
        status: "fail",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Admin successfully deactivated",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await Admin.countDocuments({ active: true });
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
  ...adminController,
  getAllAdmins,
  addAdmin,
  deactivateAdmin,
  getAnAdmin,
  updateAdmin,
  countData,
};
