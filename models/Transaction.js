const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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

transactionSchema.statics.getTransactions = function (user, year, month, category) {
  let $match = {
    user: user._id
  };

  if (year && month >= 0) {
    $match.date = {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month + 1, 0)
    };
  }

  if (category) {
    $match.category = category._id;
  }

  return this.aggregate([
    {
      $match
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
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        balance: { $sum: '$amount' }
      }
    },
    {
      $sort: { '_id': -1 }
    }
  ]);
}

transactionSchema.statics.getTrasactionsByCategory = function (user, year, month) {
  let $match = {
    user: user._id
  };

  if (year && isNaN(month)) {
    $match.date = {
      $gte: new Date(year, 0, 1),
      $lte: new Date(year, 11, 31)
    };
  }

  if (year && month >= 0) {
    $match.date = {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month + 1, 0)
    };
  }

  return this.aggregate([
    {
      $match
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
        _id: {
          _id: '$category._id',
          name: '$category.name',
          color: '$category.color'
        },
        amount: { $sum: '$amount' }
      }
    }
  ]);
};

function autopopulate(next) {
  this.populate('category');
  next();
}

transactionSchema.pre('find', autopopulate);
transactionSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Transaction', transactionSchema);
