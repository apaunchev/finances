const _ = require("lodash");
const mongoose = require("mongoose");
const Transaction = mongoose.model("Transaction");

exports.dashboard = (req, res) => {
  res.render("dashboard", { title: "My Finances" });
};

exports.months = async (req, res) => {
  const filter = req.query.filter || "";
  const months = await Transaction.getTransactionsByMonth(req.user);
  let groupedMonths = _.chain(months)
    .groupBy(m => m._id.year)
    .values()
    .reverse()
    .value();
  res.render("months", {
    title: "Browse months",
    filter,
    months: groupedMonths
  });
};
