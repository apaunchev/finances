const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(transactionsController.getTransactions));

router.get('/transactions', catchErrors(transactionsController.getTransactions));
router.get('/add', authController.isLoggedIn, catchErrors(transactionsController.addTransaction));
router.post('/add', transactionsController.processTransaction, catchErrors(transactionsController.createTransaction));
router.post('/add/:id', transactionsController.processTransaction, catchErrors(transactionsController.updateTransaction));
router.get('/transactions/:id/edit', authController.isLoggedIn, catchErrors(transactionsController.editTransaction));
router.get('/transactions/:id/remove', authController.isLoggedIn, catchErrors(transactionsController.removeTransaction));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister, userController.register, authController.login);
router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));

router.get('/api/search', catchErrors(transactionsController.search));

module.exports = router;
