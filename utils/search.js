const APIFeatures = require("./apiFeatures");

const search = async (model, fields, populate, req, res) => {
  try {
    const query = req.query.search; // The search term from the client

    // Ensure the search query is provided
    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const tokens = query.split(/\s+/).map((word) => new RegExp(word, "i")); // Split the query into tokens

    const searchConditions = tokens.map((token) => {
      return {
        $or: fields.map((field) => {
          console.log("Searching field:", field, "for token:", token);
          return { [field]: token };
        }), // Create a $or condition for each token and field
      };
    });
    let populateObject = populate;
    try {
      populateObject = eval(`(${populate})`);
    } catch (err) {
      // If evaluation fails, fallback to the string as it is
    }

    console.log(
      "Search conditions:",
      JSON.stringify(searchConditions, null, 2)
    );
    // Define the features query
    let features = new APIFeatures(
      model
        .find({
          $and: searchConditions,
        })
        .populate(populateObject || ""),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Count documents matching the query
    const totalResults = new APIFeatures(
      model.countDocuments({
        $and: searchConditions,
      }),
      req.query
    ).filter();

    // Execute the query to fetch paginated results
    let [results, numberOfActiveResults] = await Promise.all([
      features.query.lean(),
      totalResults.query.countDocuments(),
    ]);
    // Return the response
    return res.status(200).json({
      status: "success",
      numberOfActiveResults, // Total number of results found
      results: results.length, // Number of results in the current page
      data: results, // The matching documents
    });
  } catch (err) {
    console.error("Error during search:", err); // Log error for debugging
    return res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong during the search",
    });
  }
};

module.exports = { search };
