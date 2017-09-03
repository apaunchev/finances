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

transactionSchema.statics.getTransactions = function (user, date, category) {
  return this.aggregate([
    {
      $match: {
        user: user._id,
        date: {
          $gte: new Date(date.getFullYear(), date.getMonth(), 1),
          $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        },
        amount: { $lt: 0 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    }
  ]);
};

transactionSchema.statics.getTransactionsByMonth = function (user) {
  return this.aggregate([
    {
      $match: {
        user: user._id
      }
    },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        incomesAmount: { $sum: { $cond: [{ '$gt': ['$amount', 0]}, "$amount", 0] } },
        expensesAmount: { $sum: { $cond: [{ '$lt': ['$amount', 0]}, "$amount", 0] } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': -1 }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
