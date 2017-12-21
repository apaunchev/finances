const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = global.Promise;

const transactionSchema = new mongoose.Schema({
  description: String,
  date: {
    type: Date,
    default: Date.now,
    required: "Please provide a valid date."
  },
  amount: {
    type: Number,
    required: "Please provide a valid amount."
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

transactionSchema.index({
  description: "text"
});

transactionSchema.statics.getTransactions = function(user, category) {
  let $match = {
    user: user._id
  };

  if (category) {
    $match.category = category._id;
  }

  return this.aggregate([
    {
      $match
    },
    // join with categories
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $sort: { _id: -1 }
    },
    // days
    {
      $group: {
        _id: {
          dayOfMonth: { $dayOfMonth: "$date" },
          month: { $month: "$date" },
          year: { $year: "$date" }
        },
        balance: { $sum: "$amount" },
        income: {
          $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] }
        },
        expenses: {
          $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] }
        },
        date: {
          $first: "$date"
        },
        transactions: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $sort: { _id: -1 }
    },
    // months
    {
      $group: {
        _id: {
          month: "$_id.month",
          year: "$_id.year"
        },
        income: { $sum: "$income" },
        expenses: { $sum: "$expenses" },
        balance: { $sum: "$balance" },
        days: {
          $push: {
            day: "$_id.dayOfMonth",
            date: "$date",
            balance: "$balance",
            income: { $sum: "$income" },
            expenses: { $sum: "$expenses" },
            transactions: "$transactions"
          }
        }
      }
    },
    {
      $sort: { _id: -1 }
    },
    // years
    {
      $group: {
        _id: {
          year: "$_id.year"
        },
        income: { $sum: "$income" },
        expenses: { $sum: "$expenses" },
        balance: { $sum: "$balance" },
        months: {
          $push: {
            month: "$_id.month",
            income: { $sum: "$income" },
            expenses: { $sum: "$expenses" },
            balance: "$balance",
            days: "$days"
          }
        }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
};

function autopopulate(next) {
  this.populate("category");
  next();
}

transactionSchema.pre("find", autopopulate);
transactionSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Transaction", transactionSchema);
