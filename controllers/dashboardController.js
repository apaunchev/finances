const mongoose = require("mongoose");

const Category = mongoose.model("Category");

exports.dashboard = async (req, res) => {
  const categories = await Category.getCategoriesForUser({ user: req.user });

  res.render("dashboard", { title: "Finances", categories });
};
