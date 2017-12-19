const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  name: String,
  color: String,
  type: {
    type: String,
    required: true,
    enum: ["Income", "Expenses"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

categorySchema.statics.getCategoriesForUser = function(
  user,
  group = false,
  searchTerm
) {
  let pipeline = [];

  let $match = {
    user: user._id
  };

  if (searchTerm) {
    $match.name = { $regex: new RegExp(searchTerm, "i") };
  }

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

  const $sort = { count: -1 };

  pipeline.push({ $sort: $sort });

  if (group) {
    let $group = {};

    $group = {
      _id: "$type",
      categories: { $push: "$$ROOT" }
    };

    pipeline.push({ $group });

    const $sort = { _id: 1 };

    pipeline.push({ $sort });
  }

  return this.aggregate(pipeline);
};

module.exports = mongoose.model("Category", categorySchema);
