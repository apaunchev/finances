const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.addCategory = async (req, res) => {
  res.render('editCategory', { title: 'Add category' });
};

exports.createCategory = async (req, res) => {
  const category = await (new Category(req.body)).save();
  res.redirect('/categories');
};

exports.editCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  res.render('editCategory', { title: 'Edit category', category });
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
  res.redirect('/categories');
};

exports.removeCategory = async (req, res) => {
  const category = await Category.remove({ _id: req.params.id });
  res.redirect('/categories');
};
