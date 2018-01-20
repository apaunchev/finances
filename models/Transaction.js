const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = global.Promise;

const EXPENSES_TYPE = "Expenses";
const INCOME_TYPE = "Income";

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
  },
  cleared: Boolean
});

transactionSchema.statics.getAll = function(user, category, cleared) {
  let $match = {
    user: user._id
  };

  if (category) {
    $match.category = category._id;
  }

  // match by cleared only if explicitly set; otherwise it is (implicitly) undefined.
  if (cleared === true || cleared === false) {
    $match.cleared = cleared;
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
    // group by days
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
    // group by months
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
    // group by years
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

transactionSchema.statics.getFiltered = function(filters) {
  const { user, type, year, month, category, groupBy } = filters;
  let pipeline = [];

  let $match = {
    user: user._id
  };

  if (type === EXPENSES_TYPE) {
    $match.amount = { $lte: 0 };
  } else if (type === INCOME_TYPE) {
    $match.amount = { $gt: 0 };
  } else {
    $match.amount = { $lte: 0 };
  }

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

  if (category) {
    $match.category = category._id;
  }

  pipeline.push({ $match });

  const $lookup = {
    from: "categories",
    localField: "category",
    foreignField: "_id",
    as: "category"
  };

  pipeline.push({ $lookup }, { $unwind: "$category" });

  if (groupBy) {
    let $group = {};
    let $sort = {};

    if (groupBy === "date") {
      $group = {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        amount: { $sum: "$amount" }
      };

      pipeline.push({ $group });

      $sort = { _id: -1 };

      pipeline.push({ $sort });

      $group = {
        _id: {
          year: "$_id.year"
        },
        maxAmount: { $max: "$amount" },
        minAmount: { $min: "$amount" },
        months: {
          $push: {
            month: "$_id.month",
            amount: "$amount"
          }
        }
      };

      pipeline.push({ $group });

      $sort = { _id: -1 };

      pipeline.push({ $sort });

      $group = {
        _id: "Group by date",
        maxAmount: { $max: "$maxAmount" },
        minAmount: { $min: "$minAmount" },
        years: {
          $push: "$$ROOT"
        }
      };

      pipeline.push({ $group });
    } else if (groupBy === "category") {
      $group = {
        _id: {
          _id: "$category._id",
          name: "$category.name"
        },
        amount: { $sum: "$amount" }
      };

      pipeline.push({ $group });

      if (type === EXPENSES_TYPE) {
        $sort = { amount: 1 };
      } else if (type === INCOME_TYPE) {
        $sort = { amount: -1 };
      } else {
        $sort = { amount: 1 };
      }

      pipeline.push({ $sort });

      $group = {
        _id: "Group by category",
        balance: { $sum: "$amount" },
        categories: {
          $push: "$$ROOT"
        }
      };

      pipeline.push({ $group });
    }
  }

  return this.aggregate(pipeline);
};

function autopopulate(next) {
  this.populate("category");
  next();
}

transactionSchema.pre("find", autopopulate);
transactionSchema.pre("findOne", autopopulate);

transactionSchema.index({
  description: "text"
});

module.exports = mongoose.model("Transaction", transactionSchema);
