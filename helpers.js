exports.moment = require('moment');

exports.getMonthName = (month) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[parseFloat(month)];
};

exports.settingsMenu = [
  { 'url': '/account', title: 'Account', icon: 'user' },
  { 'url': '/categories', title: 'Categories', icon: 'folder' },
  { 'url': '/budget', title: 'Budget', icon: 'bar-chart-2' }
];

exports.dump = (obj) => JSON.stringify(obj, null, 2);
