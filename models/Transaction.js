const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const transactionSchema = new mongoose.Schema({
  description: String,
  date: {
    type: Date,
    default: Date.now,
    required: 'Please provide a valid date.'
  },
  amount: {
    type: Number,
    required: 'Please provide a valid amount.'
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

transactionSchema.index({
  description: 'text'
});

transactionSchema.statics.getTransactionsByMonth = function (user, month) {
  return this.aggregate([
    { $match: {
        user: user._id,
        date: {
          $gte: new Date(month.getFullYear(), month.getMonth(), 1),
          $lte: new Date(month.getFullYear(), month.getMonth(), 31)
        },
        amount: {
          $lt: 0
        }
    } },
    { $lookup: {
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      as: 'category'
    } },
    { $unwind: '$category' }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
