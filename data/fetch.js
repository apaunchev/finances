require("dotenv").config({ path: __dirname + "/../variables.env" });

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

async function fetchData() {
  await Transaction.find({ vendor: { $ne: null } }, (err, transactions) => {
    console.log(transactions);
  });
  console.log("👍 Done!");
  process.exit();
}

fetchData();
