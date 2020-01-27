const mongoose = require("mongoose");

const Transaction = mongoose.model("Transaction");
const Category = mongoose.model("Category");
const axios = require("axios");
const fx = require("money");

const confirmOwner = (transaction, user) => {
  if (!transaction.user.equals(user._id)) {
    throw Error("Transaction not found.");
  }
};

exports.getTransactions = async (req, res) => {
  const { user } = req;
  const query = req.query;
  const category =
    req.query.category && (await Category.findOne({ _id: req.query.category }));
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month) - 1;
  const uncleared = req.query.uncleared && req.query.uncleared === "true";
  const transactions = await Transaction.getAll({
    user,
    category,
    year,
    month,
    uncleared
  });

  let title = null;
  if (category) {
    title = category.name;
  } else if (uncleared) {
    title = "Uncleared";
  } else {
    title = "All";
  }

  res.render("transactions", {
    query,
    title,
    transactions
  });
};

exports.addTransaction = async (req, res) => {
  const query = req.query;
  const categories = await Category.getCategoriesForUser({
    user: req.user,
    sortBy: "count",
    sortDirection: -1
  });

  res.render("editTransaction", {
    query,
    title: "Add transaction",
    categories
  });
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  const categories = await Category.getCategoriesForUser({ user: req.user });

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
  req.body.note = req.body.note || "";
  req.body.user = req.user._id;
  req.body.cleared = req.body.cleared === "true";
  req.body.amount = parseFloat(
    type === res.locals.h.types.expenses
      ? -Math.abs(req.body.amount)
      : Math.abs(req.body.amount)
  );

  if (userCurrency !== transactionCurrency) {
    await axios
      .get(
        `http://data.fixer.io/api//latest?access_key=${process.env.FIXER_ACCESS_KEY}`
      )
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
  await new Transaction(req.body)
    .save()
    .then(() => res.redirect("/transactions"));
};

exports.updateTransaction = async (req, res) => {
  await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  })
    .exec()
    .then(() => res.redirect("/transactions"));
};

exports.removeTransaction = async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.id }).then(() =>
    res.redirect("/transactions")
  );
};
