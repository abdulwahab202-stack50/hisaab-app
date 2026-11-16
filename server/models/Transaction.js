const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: [true, 'Transaction type is required (incoming or outgoing)'],
  },
  amount: {
    type: Number,
    required: [true, 'Please enter an amount'],
    min: [0, 'Amount must be greater than or equal to 0'],
  },
  source: {
    type: String,
    required: [true, 'Please enter a source / category'],
    trim: true,
  },
  note: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
