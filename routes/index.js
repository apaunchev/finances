const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const transactionsController = require("../controllers/transactionsController");
const settingsController = require("../controllers/settingsController");
const statsController = require("../controllers/statsController");
const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", authController.isAuthenticated, dashboardController.dashboard);

// Auth

router.get("/login", authController.login);

router.get("/logout", authController.logout);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/")
);

// Dashboard

router.get(
  "/dashboard",
  authController.isAuthenticated,
  catchErrors(dashboardController.dashboard)
);

// Transactions

router.get(
  "/transactions",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTransactions)
);

router.get(
  "/transaction/:id/edit",
  authController.isAuthenticated,
  catchErrors(transactionsController.editTransaction)
);

router.get(
  "/transaction/:id/remove",
  authController.isAuthenticated,
  catchErrors(transactionsController.removeTransaction)
);

router.get(
  "/add",
  authController.isAuthenticated,
  catchErrors(transactionsController.addTransaction)
);

router.post(
  "/add",
  authController.isAuthenticated,
  transactionsController.processTransaction,
  catchErrors(transactionsController.createTransaction)
);

router.post(
  "/add/:id",
  authController.isAuthenticated,
  transactionsController.processTransaction,
  catchErrors(transactionsController.updateTransaction)
);

// Stats

router.get(
  "/stats/:type",
  authController.isAuthenticated,
  catchErrors(statsController.stats)
);

// Settings

router.get(
  "/settings",
  authController.isAuthenticated,
  settingsController.settings
);

router.get(
  "/settings/account",
  authController.isAuthenticated,
  settingsController.account
);

router.post(
  "/settings/account",
  authController.isAuthenticated,
  catchErrors(settingsController.updateAccount)
);

router.get(
  "/settings/categories",
  authController.isAuthenticated,
  catchErrors(settingsController.categories)
);

router.get(
  "/settings/categories/add",
  authController.isAuthenticated,
  catchErrors(settingsController.addCategory)
);

router.post(
  "/settings/categories/add",
  authController.isAuthenticated,
  settingsController.processCategory,
  catchErrors(settingsController.createCategory)
);

router.post(
  "/settings/categories/add/:id",
  authController.isAuthenticated,
  settingsController.processCategory,
  catchErrors(settingsController.updateCategory)
);

router.get(
  "/settings/category/:id/edit",
  authController.isAuthenticated,
  catchErrors(settingsController.editCategory)
);

router.get(
  "/settings/category/:id/remove",
  authController.isAuthenticated,
  catchErrors(settingsController.removeCategory)
);

module.exports = router;
