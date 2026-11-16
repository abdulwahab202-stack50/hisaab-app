const Transaction = require('../models/Transaction');

// Helper to build date query
const buildDateFilter = (filter) => {
  const now = new Date();

  if (filter === 'today') {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { date: { $gte: startOfToday, $lte: endOfToday } };
  }

  if (filter === 'this_week') {
    // Last 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { date: { $gte: sevenDaysAgo, $lte: now } };
  }

  if (filter === 'last_week') {
    // 7 to 14 days ago
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { date: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } };
  }

  if (filter === 'this_month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { date: { $gte: startOfMonth, $lte: endOfMonth } };
  }

  return {};
};

// @desc    Get transactions for current user (filtered)
// @route   GET /api/transactions
// @access  Private (client only sees their own)
const getTransactions = async (req, res) => {
  try {
    const { filter, type, limit } = req.query;

    const query = {
      userId: req.user._id,
      ...buildDateFilter(filter),
    };

    if (type && (type === 'incoming' || type === 'outgoing')) {
      query.type = type;
    }

    let txQuery = Transaction.find(query).sort({ date: -1 });

    if (limit && !isNaN(parseInt(limit))) {
      txQuery = txQuery.limit(parseInt(limit));
    }

    const transactions = await txQuery;

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: error.message || 'Error fetching transactions' });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { type, amount, source, note } = req.body;

    if (!type || !amount || !source) {
      return res.status(400).json({ message: 'Please provide type, amount, and source' });
    }

    if (type !== 'incoming' && type !== 'outgoing') {
      return res.status(400).json({ message: 'Type must be incoming or outgoing' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: numericAmount,
      source: source.trim(),
      note: note ? note.trim() : '',
      date: new Date(), // Auto Date + Time
    });

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: error.message || 'Error creating transaction' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Client can ONLY delete their own transactions (admin can delete any)
    if (
      transaction.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: error.message || 'Error deleting transaction' });
  }
};

// @desc    Get summary (Total Incoming, Total Outgoing, Total Balance)
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res) => {
  try {
    const { filter } = req.query;

    const matchQuery = {
      userId: req.user._id,
      ...buildDateFilter(filter),
    };

    const stats = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncoming = 0;
    let totalOutgoing = 0;
    let incomingCount = 0;
    let outgoingCount = 0;

    stats.forEach((item) => {
      if (item._id === 'incoming') {
        totalIncoming = item.totalAmount;
        incomingCount = item.count;
      } else if (item._id === 'outgoing') {
        totalOutgoing = item.totalAmount;
        outgoingCount = item.count;
      }
    });

    const totalBalance = totalIncoming - totalOutgoing;

    res.json({
      success: true,
      summary: {
        totalIncoming,
        totalOutgoing,
        totalBalance,
        incomingCount,
        outgoingCount,
        totalCount: incomingCount + outgoingCount,
        filter: filter || 'all',
      },
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: error.message || 'Error calculating summary' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
};
