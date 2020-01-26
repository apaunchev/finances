const mongoose = require("mongoose");
const helpers = require("../helpers");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 64
    },
    color: {
      type: String,
      required: false,
      default: "#222222",
      maxlength: 7
    },
    type: {
      type: String,
      required: true,
      enum: [helpers.types.expenses, helpers.types.income]
    },
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

categorySchema.statics.getCategoriesForUser = function({
  user,
  groupBy = "type",
  sortBy = "name",
  sortDirection = 1
}) {
  let pipeline = [];

  let $match = {
    user: user._id
  };

  pipeline.push({ $match });

  const $lookup = {
    from: "transactions",
    localField: "_id",
    foreignField: "category",
    as: "transactions"
  };

  pipeline.push({ $lookup });

  const $project = {
    name: "$name",
    color: 1,
    type: 1,
    count: { $size: "$transactions" }
  };

  pipeline.push({ $project });

  const $sort = { [sortBy]: sortDirection };

  pipeline.push({ $sort: $sort });

  if (groupBy) {
    let $group = {};

    $group = {
      _id: `$${groupBy}`,
      categories: { $push: "$$ROOT" }
    };

    pipeline.push({ $group });

    const $sort = { _id: 1 };

    pipeline.push({ $sort });
  }

  return this.aggregate(pipeline);
};

module.exports = mongoose.model("Category", categorySchema);
