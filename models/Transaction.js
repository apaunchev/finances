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

transactionSchema.statics.getTransactionsByDate = function (user, date, category) {
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

transactionSchema.statics.getExpensesByDate = function (user, date, category) {
  return this.aggregate([
    {
      $match: {
        user: user._id,
        amount: { $lt: 0 },
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
    },
    {
      $sort: { 'date': -1 }
    }
  ]);
};

transactionSchema.statics.getIncomesByDate = function (user, date, category) {
  return this.aggregate([
    {
      $match: {
        user: user._id,
        amount: { $gte: 0 },
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
    },
    {
      $sort: { 'date': -1 }
    }
  ]);
};

transactionSchema.statics.getTransactionsByDateAndCategory = function (user, date, category) {
  return this.aggregate([
    {
      $match: {
        user: user._id,
        category: category._id,
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

transactionSchema.statics.getMonthlyTransactions = function (user) {
  return this.aggregate([
    {
      $match: {
        user: user._id
      }
    },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        balance: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': -1 }
    }
  ]);
};

transactionSchema.statics.getGroupedTransactions = function (user, date) {
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
    },
    {
      $group: {
        _id: '$category._id',
        name: { '$first': '$category.name' },
        color: { '$first': '$category.color' },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: { 'totalAmount': 1 }
    }
  ]);
};

transactionSchema.statics.getMonthlyExpensesAmount = function (user, date) {
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
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

transactionSchema.statics.getMonthlyIncomesAmount = function (user, date) {
  return this.aggregate([
    {
      $match: {
        user: user._id,
        date: {
          $gte: new Date(date.getFullYear(), date.getMonth(), 1),
          $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        },
        amount: { $gte: 0 }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
