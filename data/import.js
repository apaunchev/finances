require('dotenv').config({ path: `${__dirname}/../variables.env` });
const fs = require('fs');

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Transaction = require('../models/Transaction');

const transactions = JSON.parse(fs.readFileSync(`${__dirname}/transactions.json`, 'utf-8'));

async function deleteData() {
  await Transaction.remove();
  console.log('👍 Done!');
  process.exit();
}

async function importData() {
  try {
    await Transaction.insertMany(transactions);
    console.log('👍 Done!');
    process.exit();
  } catch (e) {
    console.log('👎 Error! If importing, make sure to drop existing data first.');
    console.log(e);
    process.exit();
  }
}

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  importData();
}
