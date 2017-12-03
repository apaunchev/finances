module.exports = {
  dashboard: {
    appNavLeft: [{ url: "/logout", title: "Log out", icon: "log-out" }],
    appNavRight: [{ url: "/add", title: "Add", icon: "plus-circle" }],
    contentList: [
      {
        url: "/transactions",
        title: "This month",
        icon: "inbox"
      },
      {
        url: "/months",
        title: "Browse months",
        icon: "calendar"
      },
      {
        url: "/reports",
        title: "Reports",
        icon: "pie-chart"
      },
      {
        url: "/statistics",
        title: "Statistics",
        icon: "bar-chart-2"
      },
      {
        url: "/settings",
        title: "Settings",
        icon: "settings"
      }
    ]
  },
  transactions: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "menu" }],
    appNavRight: [
      { url: "/add", title: "Add", icon: "plus-circle" },
      { url: "/search", title: "Search", icon: "search" }
    ]
  },
  stats: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "menu" }]
  },
  reports: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "menu" }],
    contentList: [
      {
        url: "/reports/categories",
        title: "What do I spend my money on?",
        icon: "credit-card"
      },
      {
        url: "/reports/payees",
        title: "Where do I spend my money?",
        icon: "shopping-cart"
      },
      {
        url: "/reports/trends",
        title: "How much do I earn compared to my expenses?",
        icon: "pie-chart"
      }
    ]
  },
  reportsCategories: {
    appNavRight: [
      { url: "/months?filter=categories", title: "Filter", icon: "filter" }
    ]
  },
  settings: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "menu" }],
    contentList: [
      { url: "/settings/account", title: "Account", icon: "user" },
      { url: "/settings/categories", title: "Categories", icon: "folder" }
    ]
  },
  settingsAccount: {
    appNavLeft: [{ url: "/settings", title: "Settings", icon: "chevron-left" }]
  },
  settingsCategories: {
    appNavLeft: [{ url: "/settings", title: "Settings", icon: "chevron-left" }],
    appNavRight: [
      {
        url: "/settings/categories/add",
        title: "Add category",
        icon: "plus-circle"
      }
    ]
  }
};
