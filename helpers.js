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

exports.formatNumber = n => {
  return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

exports.settingsMenu = [
  { url: "/account", title: "Account", icon: "user" },
  { url: "/settings/categories", title: "Categories", icon: "folder" }
];

exports.dump = obj => JSON.stringify(obj, null, 2);
