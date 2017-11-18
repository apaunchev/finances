const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const transactionsController = require("../controllers/transactionsController");
const settingsController = require("../controllers/settingsController");
const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", catchErrors(transactionsController.getTransactions));

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

// Transactions

router.get(
  "/dashboard",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTransactionsByMonth)
);

router.get(
  "/transactions",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTransactions)
);

router.get(
  "/transactions/:category",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTransactionsByCategory)
);

router.get(
  "/transactions/:year/:month",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTransactions)
);

router.get(
  "/transactions/:year/:month/:category",
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
  transactionsController.processCurrency,
  transactionsController.processTransaction,
  catchErrors(transactionsController.createTransaction)
);

router.post(
  "/add/:id",
  authController.isAuthenticated,
  transactionsController.processCurrency,
  transactionsController.processTransaction,
  catchErrors(transactionsController.updateTransaction)
);

// Categories

router.get(
  "/categories",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTrasactionsByCategory)
);

router.get(
  "/categories/:year",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTrasactionsByCategory)
);

router.get(
  "/categories/:year/:month",
  authController.isAuthenticated,
  catchErrors(transactionsController.getTrasactionsByCategory)
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

// Statistics

router.get(
  "/statistics",
  authController.isAuthenticated,
  catchErrors(transactionsController.statistics)
);

// Search

router.get(
  "/search",
  authController.isAuthenticated,
  transactionsController.search
);

router.post(
  "/search",
  authController.isAuthenticated,
  catchErrors(transactionsController.performSearch)
);

// API

router.get(
  "/api/search",
  authController.isAuthenticated,
  catchErrors(transactionsController.search)
);

module.exports = router;
