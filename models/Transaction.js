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
        }
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

transactionSchema.statics.getTrasactionsByCategory = function (user, year, month) {
  const now = new Date();
  let dateRange = {};

  if (isNaN(year) && isNaN(month)) {
    month = now.getMonth();
    year = now.getFullYear();
  }
  
  if (year && isNaN(month)) {
    dateRange = {
      $gte: new Date(year, 0, 1),
      $lte: new Date(year, 11, 31)
    };
  } else {
    dateRange = {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month + 1, 0)
    };
  }

  return this.aggregate([
    {
      $match: {
        user: user._id,
        date: dateRange
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
    },
    {
      $group: {
        _id: { _id: '$category._id', name: '$category.name' },
        count: { $sum: 1 },
        amount: { $sum: '$amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
