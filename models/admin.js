const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
// Create a unique partial index on email for active users only
adminSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

// Create the Admin model
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
