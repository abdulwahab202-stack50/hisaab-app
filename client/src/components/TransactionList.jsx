import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Calendar,
  Clock,
  Inbox,
  AlertCircle,
} from 'lucide-react';

const TransactionList = ({
  title,
  type, // 'incoming' or 'outgoing'
  transactions = [],
  onDelete,
  onAddNew,
  isDeletingId,
}) => {
  const isIncoming = type === 'incoming';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isIncoming ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isIncoming ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{title}</h3>
            <span className="text-xs text-slate-500">
              {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>

        <button
          onClick={onAddNew}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
            isIncoming
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          + Add New
        </button>
      </div>

      {/* List Body */}
      <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
        {transactions.length === 0 ? (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No {isIncoming ? 'incoming' : 'outgoing'} records</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              No transactions found for this timeframe. Add one using the button above.
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isIncoming ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isIncoming ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{tx.source}</h4>
                  </div>

                  {tx.note && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{tx.note}</p>
                  )}

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1.5 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(tx.date)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatTime(tx.date)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount and Delete Action */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="text-right">
                  <span
                    className={`text-base font-extrabold ${
                      isIncoming ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncoming ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>

                <button
                  onClick={() => onDelete(tx._id)}
                  disabled={isDeletingId === tx._id}
                  title="Delete record"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-80 group-hover:opacity-100"
                >
                  {isDeletingId === tx._id ? (
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
