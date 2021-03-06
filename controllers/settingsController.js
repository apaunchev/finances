const mongoose = require("mongoose");

const User = mongoose.model("User");
const Category = mongoose.model("Category");
const Transaction = mongoose.model("Transaction");

exports.settings = (req, res) => {
  res.render("settings", { title: "Settings" });
};

exports.account = (req, res) => {
  res.render("settingsAccount", { title: "Account" });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    currency: req.body.currency,
    timezone: req.body.timezone
  };

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true }
  ).then(() => res.redirect("/settings/account"));
};

exports.categories = async (req, res) => {
  const categories = await Category.getCategoriesForUser({
    user: req.user,
    groupBy: "type"
  });

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
  await new Category(req.body)
    .save()
    .then(() => res.redirect("/settings/categories"));
};

exports.editCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  const transactionsCount = await Transaction.countDocuments({
    category: category._id
  });

  res.render("editCategory", {
    title: "Edit category",
    category,
    transactionsCount
  });
};

exports.updateCategory = async (req, res) => {
  await Category.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true
    }
  ).then(() => res.redirect("/settings/categories"));
};

exports.removeCategory = async (req, res) => {
  await Category.remove({ _id: req.params.id }).then(() =>
    res.redirect("/settings/categories")
  );
};
