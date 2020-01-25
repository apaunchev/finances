const mongoose = require("mongoose");

const Category = mongoose.model("Category");

exports.dashboard = async (req, res) => {
  const categories = await Category.getCategoriesForUser(req.user, true);

  res.render("dashboard", { title: "My Finances", categories });
};
