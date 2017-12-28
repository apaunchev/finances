const mongoose = require("mongoose");
const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");

exports.stats = async (req, res) => {
  let type = parseInt(req.query.type) || -1;
  let year = parseInt(req.query.year);
  let month = parseInt(req.query.month) - 1;
  const category =
    req.query.category && (await Category.findOne({ _id: req.query.category }));

  if (!year && !month) {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth();
  }

  const categories = await Transaction.getByCategory(
    req.user,
    type,
    year,
    month,
    category
  );

  type = type === -1 ? "Expenses" : "Income";

  res.render("stats", {
    title: type,
    categories: categories[0],
    type,
    year,
    month
  });
};
