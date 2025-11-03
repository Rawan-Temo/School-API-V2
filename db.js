const mongoose = require("mongoose");
const createDefaultAdmin = require("./utils/createDefaultAdmin");
const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);

module.exports = async function connection() {
  try {
    await mongoose.connect(DB);
    createDefaultAdmin();
    console.log("DB CONNECTION");
  } catch (error) {
    console.log(error);
  }
};
2;
