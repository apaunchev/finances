const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(transactionsController.getTransactions));
router.get('/transactions', catchErrors(transactionsController.getTransactions));
router.get('/add', transactionsController.addTransaction);
router.post('/add', catchErrors(transactionsController.createTransaction));
router.post('/add/:id', catchErrors(transactionsController.updateTransaction));
router.get('/transactions/:id/edit', catchErrors(transactionsController.editTransaction));

module.exports = router;
