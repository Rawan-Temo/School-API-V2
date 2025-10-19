exports.deActivateMany = async (model, req, res) => {
  try {
    console.log(req.body);
    const Ids = req.body.data.ids;
    let result;

    // Validate input
    if (!Ids || !Array.isArray(Ids) || Ids.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input: 'ids' must be a non-empty array.",
      });
    }

    result = await model.deleteMany(
      { _id: { $in: Ids } } // Match documents with IDs in the array
    );

    // Check if any documents were modified
    if (result.deletedCount === 0) {
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
