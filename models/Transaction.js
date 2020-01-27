const mongoose = require("mongoose");
const helpers = require("../helpers");

const transactionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true
    },
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    payee: {
      type: String,
      required: false,
      maxlength: 64
    },
    note: {
      type: String,
      required: false,
      maxlength: 256
    },
    cleared: Boolean
  },
  { timestamps: true }
);

transactionSchema.statics.getAll = function(filters) {
  const { user, category, year, month, uncleared } = filters;
  const timezone = user.timezone || "UTC";

  let $match = {
    user: user._id
  };

  if (category) {
    $match.category = category._id;
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

  if (uncleared) {
    $match.cleared = false;
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
          dayOfMonth: {
            $dayOfMonth: { date: "$date", timezone }
          },
          month: { $month: { date: "$date", timezone } },
          year: { $year: { date: "$date", timezone } }
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
  const timezone = user.timezone || "UTC";
  let pipeline = [];

  let $match = {
    user: user._id
  };

  if (type === helpers.types.expenses) {
    $match.amount = { $lte: 0 };
  } else if (type === helpers.types.income) {
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
          year: { $year: { date: "$date", timezone } },
          month: { $month: { date: "$date", timezone } }
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
          name: "$category.name",
          color: "$category.color"
        },
        amount: { $sum: "$amount" }
      };

      pipeline.push({ $group });

      if (type === helpers.types.expenses) {
        $sort = { amount: 1 };
      } else if (type === helpers.types.income) {
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
