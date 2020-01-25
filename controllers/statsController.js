const mongoose = require("mongoose");

const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");

exports.stats = async (req, res) => {
  const { user } = req;
  const { type } = req.params;
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month) - 1;
  const category =
    req.query.category && (await Category.findOne({ _id: req.query.category }));

  const chartData = await Transaction.getFiltered({
    user,
    type,
    category,
    groupBy: "date"
  });

  const categories = await Transaction.getFiltered({
    user,
    type,
    year,
    month,
    category,
    groupBy: "category"
  });

  res.render("stats", {
    title: type,
    type,
    year,
    month,
    category,
    chartData: chartData[0],
    categories: categories[0]
  });
};
