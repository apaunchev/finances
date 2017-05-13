const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.render('transactions', { title: 'Transactions', transactions });
};

exports.addTransaction = (req, res) => {
  res.render('editTransaction', { title: 'Add transaction' });
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  res.render('editTransaction', { title: 'Edit transaction', transaction });
};

exports.createTransaction = async (req, res) => {
  const transaction = await (new Transaction(req.body)).save();
  res.redirect('/');
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
  res.redirect('/');
};
