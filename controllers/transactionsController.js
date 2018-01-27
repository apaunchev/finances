const mongoose = require("mongoose");
const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");
const moment = require("moment");
const axios = require("axios");
const fx = require("money");

exports.getTransactions = async (req, res) => {
  const user = req.user;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const category =
    req.query.category && (await Category.findOne({ _id: req.query.category }));
  const uncleared = req.query.uncleared && req.query.uncleared == "true";
  const all = req.query.all && req.query.all == "true";

  const transactions = await Transaction.getAll({
    user,
    year,
    month,
    category,
    uncleared,
    all
  });

  res.render("transactions", {
    title: category
      ? category.name
      : uncleared ? "Uncleared" : all ? "All" : "This month",
    transactions,
    category
  });
};

exports.addTransaction = async (req, res) => {
  const categories = await Category.getCategoriesForUser(req.user, true);

  res.render("editTransaction", { title: "Add transaction", categories });
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  const categories = await Category.getCategoriesForUser(req.user, true);

  confirmOwner(transaction, req.user); // TODO: middleware

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
  req.body.amount = parseFloat(
    type === "Expenses" ? -Math.abs(req.body.amount) : Math.abs(req.body.amount)
  );
  req.body.cleared = req.body.cleared == "true";

  if (userCurrency !== transactionCurrency) {
    await axios
      .get("https://api.fixer.io/latest")
      .then(res => {
        fx.base = res.data.base;
        fx.rates = res.data.rates;
      })
      .catch(err => console.error(err));

    req.body.amount =
      fx(req.body.amount)
        .from(transactionCurrency)
        .to(userCurrency)
        .toFixed(2) / 1;
  }

  next();
};

exports.createTransaction = async (req, res) => {
  const transaction = await new Transaction(req.body).save();

  res.redirect("/transactions");
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  ).exec();

  res.redirect("/transactions");
};

exports.removeTransaction = async (req, res) => {
  const transaction = await Transaction.remove({ _id: req.params.id });

  res.redirect("/transactions");
};

const confirmOwner = (transaction, user) => {
  if (!transaction.user.equals(user._id)) {
    throw Error("Transaction not found.");
  }
};
