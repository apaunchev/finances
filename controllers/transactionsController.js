const _ = require("lodash");
const mongoose = require("mongoose");
const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");
const axios = require("axios");
const fx = require("money");
const {
  getSortedCategories,
  getMinMaxAmount,
  getTotalAmount,
  weekDays
} = require("../helpers");

exports.getTransactions = async (req, res) => {
  const user = req.user;
  const now = new Date();
  let withFullDate = false;
  let year = req.query.year;
  let month = parseInt(req.query.month) - 1;
  const category =
    req.query.category && (await Category.findOne({ _id: req.query.category }));

  if (!year && !month && !category) {
    year = now.getFullYear();
    month = now.getMonth();
  } else if (!year && !month && category) {
    withFullDate = true; // If params contain only category, we want to see all transactions for that category.
  }

  const transactions = await Transaction.getTransactions(
    user,
    year,
    month,
    category
  );
  const dailyTransactions = formatTransactions(transactions, withFullDate);

  res.render("transactions", {
    title: "Transactions",
    transactions: dailyTransactions,
    month,
    year,
    category
  });
};

exports.getTransactionsByMonth = async (req, res) => {
  const months = await Transaction.getTransactionsByMonth(req.user);
  let groupedMonths = _.chain(months)
    .groupBy(m => m._id.year)
    .values()
    .reverse()
    .value();
  res.render("dashboard", { title: "Dashboard", months: groupedMonths });
};

exports.addTransaction = async (req, res) => {
  const categories = await Category.getCategoriesForUser(req.user, true);
  res.render("editTransaction", { title: "Add transaction", categories });
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  confirmOwner(transaction, req.user);
  const categories = await Category.getCategoriesForUser(req.user, true);
  res.render("editTransaction", {
    title: "Edit transaction",
    transaction,
    categories
  });
};

exports.processTransaction = async (req, res, next) => {
  const userCurrency = req.user.currency || "EUR";
  const transactionCurrency = req.body.currency;
  const category = req.body.category.split(":"); // Expenses:5921bd186ba4914d25133815:Personal
  const type = category[0]; // Expenses or Income

  req.body.date = req.body.date || Date.now();
  req.body.category = category[1];
  req.body.description = req.body.description || category[2];
  req.body.user = req.user._id;
  req.body.amount = parseFloat(type === "Expenses" ? -Math.abs(req.body.amount) : Math.abs(req.body.amount));

  if (userCurrency !== transactionCurrency) {
    await axios
      .get("https://api.fixer.io/latest")
      .then(res => {
        fx.base = res.data.base;
        fx.rates = res.data.rates;
      })
      .catch(err => console.error(err));

    req.body.amount =
      fx(amount)
        .from(transactionCurrency)
        .to(userCurrency)
        .toFixed(2) / 1;
  }

  next();
};

exports.createTransaction = async (req, res) => {
  const transaction = await new Transaction(req.body).save();
  const date = new Date(transaction.date);
  res.redirect(
    `/transactions?year=${date.getFullYear()}&month=${date.getMonth() + 1}`
  );
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  ).exec();
  const date = new Date(transaction.date);
  res.redirect(
    `/transactions?year=${date.getFullYear()}&month=${date.getMonth() + 1}`
  );
};

exports.removeTransaction = async (req, res) => {
  const transaction = await Transaction.remove({ _id: req.params.id });
  res.redirect("/transactions");
};

exports.search = (req, res) => {
  res.render("search", { title: "Search" });
};

exports.performSearch = async (req, res) => {
  const term = req.body.term;
  const transactions = await Transaction.find(
    { $text: { $search: term } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" }, date: -1 });
  const dailyTransactions = formatTransactions(transactions, true);
  res.render("transactions", {
    title: `Search: ${term}`,
    transactions: dailyTransactions
  });
};

const confirmOwner = (transaction, user) => {
  if (!transaction.user.equals(user._id)) {
    throw Error("Transaction not found.");
  }
};

const formatTransactions = (transactions, withFullDate = false) => {
  return _.chain(transactions)
    .groupBy(transaction => {
      const date = new Date(transaction.date);
      return withFullDate
        ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        : date.getDate();
    })
    .mapValues(group => {
      const date = new Date(group[0].date);
      const transactions = _.chain(group)
        .sortBy(date)
        .reverse()
        .value();
      return {
        transactions,
        totalAmount: getTotalAmount(group),
        date,
        dayOfMonth: date.getDate(),
        dayOfWeek: weekDays[date.getDay()],
        fullDateString: withFullDate
          ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
          : null
      };
    })
    .sortBy("date")
    .reverse()
    .value();
};
