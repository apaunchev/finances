const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  name: String,
  color: String
});

module.exports = mongoose.model('Category', categorySchema);
