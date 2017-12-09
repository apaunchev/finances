const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  name: String,
  color: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

categorySchema.statics.getMostUsedCategoriesForUser = function(user) {
  let $match = {
    user: user._id
  };

  return this.aggregate([
    {
      $match
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "category",
        as: "transactions"
      }
    },
    {
      $project: {
        name: "$name",
        transactions: { $size: "$transactions" }
      }
    },
    {
      $sort: { transactions: -1 }
    }
  ]);
};

module.exports = mongoose.model("Category", categorySchema);
