module.exports = {
  dashboard: {
    appNavLeft: [{ url: "/settings", title: "Settings", icon: "settings" }],
    appNavRight: [{ url: "/add", title: "Add", icon: "plus-circle" }],
    appSubNav: [
      { url: "/dashboard", title: "Overview", selected: true },
      { url: "/statistics", title: "Statistics", selected: false }
    ]
  },
  transactions: {
    appNavLeft: [{ url: "/dashboard", title: "Dashboard", icon: "calendar" }],
    appNavRight: [
      { url: "/add", title: "Add", icon: "plus-circle" },
      { url: "/search", title: "Search", icon: "search" }
    ]
  },
  stats: {
    appNavLeft: [{ url: "/settings", title: "Settings", icon: "settings" }],
    appSubNav: [
      { url: "/dashboard", title: "Overview", selected: false },
      { url: "/statistics", title: "Statistics", selected: true }
    ]
  },
  settings: {
    appNavLeft: [
      { url: "/dashboard", title: "Dashboard", icon: "chevron-left" }
    ],
    appNavRight: [{ url: "/logout", title: "Log out", icon: "log-out" }],
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
