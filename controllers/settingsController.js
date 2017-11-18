const mongoose = require("mongoose");
const User = mongoose.model("User");
const Category = mongoose.model("Category");

exports.settings = (req, res) => {
  res.render("settings", { title: "Settings" });
};

exports.account = (req, res) => {
  res.render("account", { title: "Account" });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    currency: req.body.currency
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.redirect("back");
};

exports.categories = async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort("name");
  res.render("settingsCategories", { title: "Categories", categories });
};

exports.addCategory = async (req, res) => {
  res.render("editCategory", { title: "Add category" });
};

exports.processCategory = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

exports.createCategory = async (req, res) => {
  const category = await new Category(req.body).save();
  res.redirect("/settings/categories");
};

exports.editCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  res.render("editCategory", { title: "Edit category", category });
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  ).exec();
  res.redirect("/settings/categories");
};

exports.removeCategory = async (req, res) => {
  const category = await Category.remove({ _id: req.params.id });
  res.redirect("/settings/categories");
};
