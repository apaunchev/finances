const _ = require("lodash");
const mongoose = require("mongoose");
const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");
const {
  getSortedCategories,
  getTotalAmount,
  getMonthName,
  getMinMaxAmount
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

exports.stats = async (req, res) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const transactions = await Transaction.find(
    { user: req.user },
    { description: 0, category: 0, user: 0 }
  );
  const monthly = _.filter(transactions, transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
  const yearly = _.filter(
    transactions,
    transaction => new Date(transaction.date).getFullYear() === year
  );
  const stats = {
    "This month": generateStatsObject(monthly),
    "This year": generateStatsObject(yearly),
    Overall: generateStatsObject(transactions)
  };
  res.render("stats", { title: "Stats", stats, month, year });
};

const generateStatsObject = data => {
  return {
    "Total income": getTotalAmount(data, 1),
    "Total expenses": getTotalAmount(data, -1),
    "Highest income": getMinMaxAmount(data, 1),
    "Highest expense": getMinMaxAmount(data, -1),
    Balance: getTotalAmount(data)
  };
};
