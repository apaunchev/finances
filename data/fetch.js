require('dotenv').config({ path: `${__dirname}/../variables.env` });

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

async function fetchData() {
  await Category.update({}, { $set: { type: 'Expenses' } }, { multi: true, runValidators: true });

  // await Transaction.update(
  //   { type: -1 },
  //   // { $mul: { amount: -1 } },
  //   { $unset: { type: "" } },
  //   { multi: true }
  // );

  console.log('👍 Done!');
  process.exit();
}

fetchData();
