const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user });
  res.render('transactions', { title: 'Transactions', transactions });
};

exports.addTransaction = (req, res) => {
  res.render('editTransaction', { title: 'Add transaction' });
};

const confirmOwner = (transaction, user) => {
  if (!transaction.user.equals(user._id)) {
    throw Error('Transaction not found.');
  }
};

exports.editTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  confirmOwner(transaction, req.user);
  res.render('editTransaction', { title: 'Edit transaction', transaction });
};

exports.createTransaction = async (req, res) => {
  req.body.user = req.user._id;
  const transaction = await (new Transaction(req.body)).save();
  res.redirect('/');
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
  res.redirect('/');
};

exports.search = async (req, res) => {
  const transactions = await Transaction.find({
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  .sort({
    score: { $meta: 'textScore' }
  })
  .limit(5);
  res.json(transactions);
};
