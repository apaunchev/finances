const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Category = mongoose.model('Category');
const _ = require('lodash');

exports.getTransactions = async (req, res) => {
  const now = new Date();
  const year = req.params.year;
  const month = parseInt(req.params.month) - 1;
  if (isNaN(year) && isNaN(month)) {
    res.redirect(`/transactions/${now.getFullYear()}/${now.getMonth() + 1}`);
    return;
  }
  const user = req.user;
  const category = await Category.findOne({ _id: req.params.category });
  const transactions = await Transaction.getTransactions(user, year, month, category);
  const dailyTransactions = formatTransactions(transactions);
  res.render('transactions', { title: 'Transactions', transactions: dailyTransactions, month, year, category });
};

exports.getTransactionsByMonth = async (req, res) => {
  const months = await Transaction.getTransactionsByMonth(req.user);
  let groupedMonths = _.chain(months)
    .groupBy(m => m._id.year)
    .values()
    .reverse()
    .value();
  res.render('months', { title: 'Choose a month', months: groupedMonths });
};

exports.getTrasactionsByCategory = async (req, res) => {
  const year = req.params.year;
  const month = parseInt(req.params.month) - 1;
  const categories = await Transaction.getTrasactionsByCategory(req.user, year, month);
  const filteredCategories = {
    Income: {
      categories: getSortedCategories(categories, 1),
      totalAmount: getTotalAmount(categories, 1)
    },
    Expenses: {
      categories: getSortedCategories(categories, -1),
      totalAmount: getTotalAmount(categories, -1)
    }
  };
  res.render('categories', { categories: filteredCategories, year, month });
};

exports.addTransaction = async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.render('editTransaction', { title: 'Add transaction', categories });
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  const categories = await Category.find({ user: req.user._id });
  confirmOwner(transaction, req.user);
  res.render('editTransaction', { title: 'Edit transaction', transaction, categories });
};

exports.processTransaction = (req, res, next) => {
  const category = req.body.category.split('|');
  req.body.user = req.user._id;
  req.body.amount = parseFloat(req.body.amount);
  req.body.date = req.body.date || Date.now();
  req.body.category = category[0];
  req.body.description = req.body.description || category[1];
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

exports.statistics = async (req, res) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const transactions = await Transaction.find({ user: req.user }, { description: 0, category: 0, user: 0 });
  const monthly = _.filter(transactions, (transaction) => {
    const date = new Date(transaction.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
  const yearly = _.filter(transactions, (transaction) => new Date(transaction.date).getFullYear() === year);
  const stats = {
    'This month': generateStatsObject(monthly),
    'This year': generateStatsObject(yearly),
    Overall: generateStatsObject(transactions)
  };
  res.render('stats', { stats, month, year });
};

exports.search = async (req, res) => {
  res.render('search');
};

exports.performSearch = async (req, res) => {
  const term = req.body.term;
  const transactions = await Transaction
    .find({ $text: { $search: term } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, date: -1 });
  const dailyTransactions = formatTransactions(transactions, true);
  res.render('searchResults', { term, transactions: dailyTransactions });
};

const confirmOwner = (transaction, user) => {
  if (!transaction.user.equals(user._id)) {
    throw Error('Transaction not found.');
  }
};

const formatTransactions = (transactions, withFullDate = false) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return _.chain(transactions)
    .groupBy(transaction => {
      const date = new Date(transaction.date);
      return withFullDate ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` : date.getDate();
    })
    .mapValues(group => {
      const date = new Date(group[0].date);
      const transactions = _.chain(group).sortBy(date).reverse().value();
      return {
        transactions,
        totalAmount: getTotalAmount(group),
        date,
        dayOfMonth: date.getDate(),
        dayOfWeek: weekDays[date.getDay()],
        fullDateString: withFullDate ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` : null
      };
    })
    .sortBy('date')
    .reverse()
    .value();
};

const generateStatsObject = (data) => {
  return {
    'Total income': getTotalAmount(data, 1),
    'Total expenses': getTotalAmount(data, -1),
    'Highest income': getMinMaxAmount(data, 1),
    'Highest expense': getMinMaxAmount(data, -1),
    'Balance': getTotalAmount(data)
  };
};

// type === -1: expenses
// type === 0: all
// type === 1: income

const getSortedCategories = (categories, type = -1) => {
  return _.chain(categories)
    .filter(c => type === -1 ? c.amount < 0 : c.amount > 0)
    .sortBy(c => type === -1 ? c.amount : -c.amount)
    .value();
};

const getMinMaxAmount = (transactions, type = -1) => {
  if (type === -1) {
    transactions = transactions.filter(t => t.amount <= 0);
    if (transactions.length === 0) {
      return 0;
    }
    return _.minBy(transactions, t => t.amount);
  } else if (type === 1) {
    transactions = transactions.filter(t => t.amount > 0);
    if (transactions.length === 0) {
      return 0;
    }
    return _.maxBy(transactions, t => t.amount);
  }
  return 0;
};

const getTotalAmount = (transactions, type = 0) => {
  if (!transactions.length) {
    return 0;
  }
  if (type === -1) {
    transactions = transactions.filter(t => t.amount <= 0);
  } else if (type === 1) {
    transactions = transactions.filter(t => t.amount > 0);
  }
  return transactions.reduce((a, b) => a + b.amount, 0);
};
