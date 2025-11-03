const bcrypt = require("bcrypt"); // make sure bcrypt is imported
const User = require("../models/user");

async function createDefaultAdmin() {
  const adminUser = await User.findOne({ role: "Admin" });
  console.log(adminUser);
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash("Admin@2025", 10);
    const defaultAdmin = new User({
      username: "adminForSchool",
      password: hashedPassword,
      role: "Admin",
    });
    await defaultAdmin.save();
    console.log("Default admin user created.");
  } else {
    console.log("Admin user already exists.");
  }
}
module.exports = createDefaultAdmin;
