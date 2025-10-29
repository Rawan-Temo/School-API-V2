// utils/controllerFactory.js
const APIFeatures = require("./apiFeatures");
const { search } = require("./search");

const createController = (Model, modelName, searchFields, populate = "") => {
  const name = modelName.toLowerCase();

  // helper: build parsed query object for filtering & counting
  const buildParsedQuery = (reqQuery) => {
    const queryObj = { ...reqQuery };
    const excludedFields = ["page", "sort", "limit", "fields", "populate"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    return JSON.parse(queryStr);
  };

  // Get all documents
  const getAll = async (req, res) => {
    if (req.query.search) {
      await search(Model, searchFields, populate, req, res);
      return;
    }
    try {
      const parsedQuery = buildParsedQuery(req.query);
      let query = Model.find();
      if (populate) {
        query = query.populate(populate);
      }

      const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const [docs, count] = await Promise.all([
        features.query.lean(),
        Model.countDocuments(parsedQuery),
      ]);
      // temp way of doing this not ideal need a better way

      if (modelName === "user") {
        docs.forEach((doc) => {
          doc.password = undefined; // Exclude password from the response
          doc.refreshToken = undefined; // Exclude refreshToken from the response
        });
      }

      res.status(200).json({
        status: "success",
        results: docs.length,
        total: count,
        data: docs,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Create new document
  const createOne = async (req, res) => {
    try {
      const newDoc = await Model.create(req.body);
      res.status(201).json({
        status: "success",
        data: newDoc,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Get one by ID
  const getOneById = async (req, res) => {
    try {
      let query = Model.findOne({ _id: req.params.id, ...req.query });
      if (populate) {
        query = query.populate(populate);
      }
      const doc = await query.lean();

      if (!doc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        data: doc,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Update one by ID
  const updateOne = async (req, res) => {
    try {
      let query = Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (populate) {
        query = query.populate(populate);
      }
      const updatedDoc = await query;

      if (!updatedDoc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        data: updatedDoc,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // deleteOne one (soft delete)
  const deleteOne = async (req, res) => {
    try {
      let query = Model.findByIdAndDelete(req.params.id);
      const doc = await query;
      if (!doc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(204).json({
        status: "success",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const deactivateOne = async (req, res) => {
    try {
      let query = Model.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      const doc = await query;

      if (!doc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        message: `${name} deactivated`,
        data: doc,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const deactivateMany = async (req, res) => {
    try {
      const Ids = req.body.ids;
      let result;

      // Validate input
      if (!Ids || !Array.isArray(Ids) || Ids.length === 0) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid input: 'ids' must be a non-empty array.",
        });
      }
      result = await Model.updateMany(
        { _id: { $in: Ids } }, // Match documents with IDs in the array
        { $set: { active: false } } // Soft delete by setting 'active' to false
      );

      // Check if any documents were modified
      if (result.modifiedCount === 0) {
        return res.status(404).json({
          status: "fail",
          message: `${Ids.length} Ids provided, but no matches found or they were already deactivated.`,
        });
      }

      // Step 2: Return success response
      return res.status(200).json({
        status: "success",
        message: ` ${Ids.length}  deleted successfully.`,
        data: null,
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error in deActivateMany:", error);
      return res.status(500).json({
        status: "fail",
        message: "An error occurred while deactivating.",
        error: error.message,
      });
    }
  };
  const deleteMany = async (req, res) => {
    try {
      const Ids = req.body.ids;
      let result;

      // Validate input
      if (!Ids || !Array.isArray(Ids) || Ids.length === 0) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid input: 'ids' must be a non-empty array.",
        });
      }
      result = await Model.deleteMany(
        { _id: { $in: Ids }, ...req.body } // Match documents with IDs in the array
      );

      // Check if any documents were modified
      if (result.deletedCount === 0) {
        return res.status(404).json({
          status: "fail",
          message: `${Ids.length} Ids provided, but no matches found or they were already deleted.`,
        });
      }

      // Step 2: Return success response
      return res.status(200).json({
        status: "success",
        message: ` ${Ids.length}  deleted successfully.`,
        data: null,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  return {
    getAll,
    createOne,
    getOneById,
    updateOne,
    deactivateOne,
    deleteOne,
    deactivateMany,
    deleteMany,
  };
};

module.exports = createController;
