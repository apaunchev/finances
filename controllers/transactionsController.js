const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Category = mongoose.model('Category');
const _ = require('lodash');

exports.getTransactions = async (req, res) => {
  const now = new Date();
  let month = parseInt(req.params.month) - 1;
  let year = req.params.year;
  if (isNaN(month) || isNaN(year)) {
    month = now.getMonth();
    year = now.getFullYear();
  }
  const transactions = await Transaction.getTransactionsByDate(req.user, new Date(year, month));
  const dailyTransactions = formatDailyTransactions(transactions);
  res.render('transactions', { title: 'Transactions', transactions: dailyTransactions });
};

exports.getMonthlyTransactions = async (req, res) => {
  const months = await Transaction.getMonthlyTransactions(req.user);
  res.render('months', { title: 'Choose a month', months });
};

exports.getGroupedTransactions = async (req, res) => {
  const now = new Date();
  let month = parseInt(req.params.month) - 1;
  let year = req.params.year;
  if (isNaN(month) || isNaN(year)) {
    month = now.getMonth();
    year = now.getFullYear();
  }
  const categories = await Transaction.getGroupedTransactions(req.user, new Date(year, month));
  let expenses = await Transaction.getMonthlyExpensesAmount(req.user, new Date(year, month));
  let incomes = await Transaction.getMonthlyIncomesAmount(req.user, new Date(year, month));
  const budget = req.user.monthlyBudget || 0;
  expenses = (expenses[0] && expenses[0].totalAmount) || 0;
  incomes = (incomes[0] && incomes[0].totalAmount) || 0;
  res.render('dashboard', { categories, budget, expenses, incomes, month, year });
};

exports.getTransactionsByCategory = async (req, res) => {
  const now = new Date();
  let month = parseInt(req.params.month) - 1;
  let year = req.params.year;
  if (isNaN(month) || isNaN(year)) {
    month = now.getMonth();
    year = now.getFullYear();
  }
  const category = await Category.findOne({ _id: req.params.category });
  const transactions = await Transaction.getTransactionsByDateAndCategory(req.user, new Date(year, month), category);
  const dailyTransactions = formatDailyTransactions(transactions);
  res.render('transactions', { transactions: dailyTransactions, month, year, category });
};

exports.getMonthlyExpenses = async (req, res) => {
  const now = new Date();
  let month = parseInt(req.params.month) - 1;
  let year = req.params.year;
  if (isNaN(month) || isNaN(year)) {
    month = now.getMonth();
    year = now.getFullYear();
  }
  const transactions = await Transaction.getExpensesByDate(req.user, new Date(year, month));
  const dailyTransactions = formatDailyTransactions(transactions);
  res.render('transactions', { transactions: dailyTransactions, month, year });
};

exports.getMonthlyIncomes = async (req, res) => {
  const now = new Date();
  let month = parseInt(req.params.month) - 1;
  let year = req.params.year;
  if (isNaN(month) || isNaN(year)) {
    month = now.getMonth();
    year = now.getFullYear();
  }
  const transactions = await Transaction.getIncomesByDate(req.user, new Date(year, month));
  const dailyTransactions = formatDailyTransactions(transactions);
  res.render('transactions', { transactions: dailyTransactions, month, year });
};

exports.addTransaction = async (req, res) => {
  const categories = await Category.find();
  res.render('editTransaction', { title: 'Add transaction', categories });
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  const categories = await Category.find();
  confirmOwner(transaction, req.user);
  res.render('editTransaction', { title: 'Edit transaction', transaction, categories });
};

exports.processTransaction = (req, res, next) => {
  const category = req.body.category.split('|');
  req.body.category = category[0];
  req.body.description = req.body.description || category[1];
  req.body.date = req.body.date || Date.now();
  req.body.amount = parseFloat(req.body.amount);
  req.body.user = req.user._id;
  next();
};

exports.createTransaction = async (req, res) => {
  const transaction = await (new Transaction(req.body)).save();
  res.redirect('/');
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
  res.redirect('/');
};

exports.removeTransaction = async (req, res) => {
  const transaction = await Transaction.remove({ _id: req.params.id });
  res.redirect('/');
};

exports.search = async (req, res) => {
  const transactions = await Transaction
    .find({ $text: { $search: req.query.q } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, date: -1 });
  res.json(transactions);
};

const formatDailyTransactions = (transactions) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return _.chain(transactions)
    .groupBy(t => new Date(t.date).getDate())
    .mapValues(daily => {
      const date = new Date(daily[0].date)
      const transactions = _.chain(daily).sortBy(date).reverse().value()
      return {
        transactions,
        totalAmount: totalAmount(daily),
        date: date.getDate(),
        dayOfWeek: weekDays[date.getDay()]
      };
    })
    .sortBy('date')
    .reverse()
    .value();
};

const totalAmount = (collection) => {
  if (!collection.length) {
    return 0;
  }
  return collection.reduce((a, b) => a + b.amount, 0);
};

const confirmOwner = (transaction, user) => {
  if (!transaction.user.equals(user._id)) {
    throw Error('Transaction not found.');
  }
};
