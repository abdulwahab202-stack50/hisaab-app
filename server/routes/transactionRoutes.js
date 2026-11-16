const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// All transaction routes require authentication
router.use(protect);

router.get('/summary', getTransactionSummary);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
