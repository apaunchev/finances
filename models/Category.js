const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  name: String,
  color: String,
  icon: String
});

module.exports = mongoose.model('Category', categorySchema);
