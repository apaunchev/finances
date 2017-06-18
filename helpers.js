exports.moment = require('moment');

exports.getMonthName = (month) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[parseFloat(month) - 1];
};

exports.dump = (obj) => JSON.stringify(obj, null, 2);
