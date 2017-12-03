const _ = require("lodash");
const mongoose = require("mongoose");
const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");
const {
  getSortedCategories,
  getTotalAmount,
  getMonthName
} = require("../helpers");

exports.reports = async (req, res) => {
  res.render("reports", { title: "Reports" });
};

exports.categories = async (req, res) => {
  const now = new Date();
  let year = req.query.year;
  let month = parseInt(req.query.month) - 1;
  if (!year && !month) {
    year = now.getFullYear();
    month = now.getMonth();
  }
  const categories = await Transaction.getTransactionsByCategory(
    req.user,
    year,
    month
  );
  const filteredCategories = {
    Expenses: {
      categories: getSortedCategories(categories, -1),
      totalAmount: getTotalAmount(categories, -1)
    },
    Incomes: {
      categories: getSortedCategories(categories, 1),
      totalAmount: getTotalAmount(categories, 1)
    }
  };

  res.render("reportsCategories", {
    title: "Categories",
    categories: filteredCategories,
    year,
    month
  });
};
