const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  name: String,
  color: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Category", categorySchema);
