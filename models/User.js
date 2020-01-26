const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    currency: {
      type: String,
      default: "EUR"
    },
    timezone: {
      type: String,
      default: "UTC"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
