const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const categoriesController = require('../controllers/categoriesController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', authController.isLoggedIn, catchErrors(transactionsController.getTransactions));

router.get('/transactions', catchErrors(transactionsController.getTransactionsByMonth));
router.get('/transactions/:year/:month', catchErrors(transactionsController.getTransactions));
router.get('/transaction/:id/edit', authController.isLoggedIn, catchErrors(transactionsController.editTransaction));
router.get('/transaction/:id/remove', authController.isLoggedIn, catchErrors(transactionsController.removeTransaction));
router.get('/transactionsByCategory', catchErrors(transactionsController.getTrasactionsByCategory));
router.get('/transactionsByCategory/:year', catchErrors(transactionsController.getTrasactionsByCategory));
router.get('/transactionsByCategory/:year/:month', catchErrors(transactionsController.getTrasactionsByCategory));
// router.get('/transactionsByCategory/:category', catchErrors(transactionsController.getTrasactionsByCategoryId));

router.get('/search', catchErrors(transactionsController.search));

router.get('/add', authController.isLoggedIn, catchErrors(transactionsController.addTransaction));
router.post('/add', transactionsController.processTransaction, catchErrors(transactionsController.createTransaction));
router.post('/add/:id', transactionsController.processTransaction, catchErrors(transactionsController.updateTransaction));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister, catchErrors(userController.register), authController.login);
router.get('/logout', authController.logout);

router.get('/settings', userController.settings);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.get('/account/forgot', authController.forgotForm);
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));

router.get('/categories', catchErrors(categoriesController.categories));
router.get('/categories/add', authController.isLoggedIn, catchErrors(categoriesController.addCategory));
router.post('/categories/add', categoriesController.processCategory, catchErrors(categoriesController.createCategory));
router.post('/categories/add/:id', categoriesController.processCategory, catchErrors(categoriesController.updateCategory));
router.get('/category/:id/edit', authController.isLoggedIn, catchErrors(categoriesController.editCategory));
router.get('/category/:id/remove', authController.isLoggedIn, catchErrors(categoriesController.removeCategory));

router.get('/api/search', catchErrors(transactionsController.search));

module.exports = router;
