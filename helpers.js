const _ = require("lodash");

exports.moment = require("moment");

exports.getMonthName = month => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return monthNames[parseFloat(month)];
};

exports.weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

exports.currencies = [
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HRK",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "RUB",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR"
];

exports.formatNumber = n => {
  return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

// type === -1: expenses
// type === 0: all
// type === 1: income

exports.getSortedCategories = (categories, type = -1) => {
  return _.chain(categories)
    .filter(c => (type === -1 ? c.amount < 0 : c.amount > 0))
    .sortBy(c => (type === -1 ? c.amount : -c.amount))
    .value();
};

exports.getMinMaxAmount = (transactions, type = -1) => {
  if (type === -1) {
    transactions = transactions.filter(t => t.amount <= 0);
    if (transactions.length === 0) {
      return 0;
    }
    return _.minBy(transactions, t => t.amount);
  } else if (type === 1) {
    transactions = transactions.filter(t => t.amount > 0);
    if (transactions.length === 0) {
      return 0;
    }
    return _.maxBy(transactions, t => t.amount);
  }
  return 0;
};

exports.getTotalAmount = (transactions, type = 0) => {
  if (!transactions.length) {
    return 0;
  }
  if (type === -1) {
    transactions = transactions.filter(t => t.amount <= 0);
  } else if (type === 1) {
    transactions = transactions.filter(t => t.amount > 0);
  }
  return transactions.reduce((a, b) => a + b.amount, 0);
};

exports.dump = obj => JSON.stringify(obj, null, 2);
