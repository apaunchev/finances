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
        url: "/settings",
        title: "Settings",
        icon: "settings"
      }
    ]
  },
  transactions: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "chevron-left" }],
    appNavRight: [
      { url: "/add", title: "Add", icon: "plus-circle" },
      { url: "/search", title: "Search", icon: "search" }
    ]
  },
  reports: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "chevron-left" }],
    contentList: [
      {
        url: "/reports/categories",
        title: "Categories",
        icon: "pie-chart"
      },
      {
        url: "/reports/stats",
        title: "Statistics",
        icon: "bar-chart-2"
      }
    ]
  },
  reportsCategories: {
    appNavRight: [
      { url: "/months?filter=categories", title: "Filter", icon: "filter" }
    ]
  },
  settings: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "chevron-left" }],
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
