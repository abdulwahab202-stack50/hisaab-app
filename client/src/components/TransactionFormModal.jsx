import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, DollarSign, Tag, FileText, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const TransactionFormModal = ({ isOpen, onClose, defaultType = 'incoming', onSuccess }) => {
  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setAmount('');
      setSource('');
      setNote('');
      setError('');
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const isIncoming = type === 'incoming';

  // Common quick presets for convenient typing
  const incomingSuggestions = ['Client Payment', 'Freelance Project', 'Salary', 'Investment', 'Consulting'];
  const outgoingSuggestions = ['Office Rent', 'Internet & Utilities', 'Software Subscriptions', 'Food & Dining', 'Equipment'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }
    if (!source.trim()) {
      setError('Please provide a source or category');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/transactions', {
        type,
        amount: Number(amount),
        source: source.trim(),
        note: note.trim(),
      });

      if (res.data.success) {
        onSuccess(res.data.transaction);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Modal Header */}
        <div className={`p-5 flex items-center justify-between text-white ${isIncoming ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {isIncoming ? <ArrowDownLeft className="w-5 h-5 text-white" /> : <ArrowUpRight className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isIncoming ? 'Add Incoming Money' : 'Add Outgoing Expense'}
              </h3>
              <p className="text-xs text-white/80">Date and time will be recorded automatically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setType('incoming')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                isIncoming
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Incoming (+ Cash)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('outgoing')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                !isIncoming
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Outgoing (- Expense)</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Amount ($) <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-base font-semibold focus:outline-none focus:ring-2 ${
                  isIncoming ? 'focus:ring-emerald-500 focus:border-emerald-500' : 'focus:ring-rose-500 focus:border-rose-500'
                }`}
              />
            </div>
          </div>

          {/* Source / Category Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Source / Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder={isIncoming ? 'e.g. Client Payment, Web App Project' : 'e.g. Office Rent, Cloud Server'}
                className={`block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  isIncoming ? 'focus:ring-emerald-500 focus:border-emerald-500' : 'focus:ring-rose-500 focus:border-rose-500'
                }`}
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center">Quick:</span>
              {(isIncoming ? incomingSuggestions : outgoingSuggestions).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSource(item)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Note Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Note (Optional)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add optional notes, invoice numbers, or payment methods..."
                className={`block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  isIncoming ? 'focus:ring-emerald-500 focus:border-emerald-500' : 'focus:ring-rose-500 focus:border-rose-500'
                }`}
              ></textarea>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Timestamp will be automatically saved as {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all flex items-center space-x-2 ${
                isIncoming
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
              } disabled:opacity-50`}
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Save {isIncoming ? 'Incoming' : 'Outgoing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
