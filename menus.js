module.exports = {
  dashboard: {
    appNavLeft: [{ url: "/settings", title: "Settings", icon: "sliders" }],
    appNavRight: [
      { url: "/add", title: "Add", icon: "plus-circle" },
      { url: "/search", title: "Search", icon: "search" }
    ],
    contentList: [
      { url: "/transactions", title: "All", icon: "arrow-right-circle" },
      {
        url: "/transactions?uncleared=true",
        title: "Uncleared",
        icon: "circle"
      }
    ]
  },
  transactions: {
    appNavLeft: [
      { url: "/dashboard", title: "Dashboard", icon: "chevron-left" }
    ]
  },
  settings: {
    appNavLeft: [
      { url: "/dashboard", title: "Dashboard", icon: "chevron-left" }
    ],
    contentList: [
      { url: "/settings/categories", title: "Categories", icon: "folder" },
      { url: "/settings/account", title: "Account", icon: "user" },
      { url: "/logout", title: "Logout", icon: "log-out" }
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
