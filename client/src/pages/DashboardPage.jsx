import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import TransactionList from '../components/TransactionList';
import TransactionFormModal from '../components/TransactionFormModal';
import {
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Wallet,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  // State
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState({
    totalIncoming: 0,
    totalOutgoing: 0,
    totalBalance: 0,
    incomingCount: 0,
    outgoingCount: 0,
    totalCount: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('incoming');

  // Fetch summary and transactions
  const fetchData = useCallback(async (selectedFilter = filter, showSpinner = true) => {
    if (showSpinner) setRefreshing(true);
    try {
      const [summaryRes, txRes] = await Promise.all([
        api.get(`/transactions/summary?filter=${selectedFilter}`),
        api.get(`/transactions?filter=${selectedFilter}`),
      ]);

      if (summaryRes.data.success) {
        setSummary(summaryRes.data.summary);
      }
      if (txRes.data.success) {
        setTransactions(txRes.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData(filter, true);
  }, [filter, fetchData]);

  // Handle filter selection
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Open modal with specific type
  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // Handle transaction creation success
  const handleTransactionSuccess = (newTx) => {
    // Re-fetch data to automatically update balance & lists
    fetchData(filter, false);
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    setIsDeletingId(id);
    try {
      const res = await api.delete(`/transactions/${id}`);
      if (res.data.success) {
        // Optimistically remove from list and refresh summary
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        fetchData(filter, false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Filter transactions into Incoming and Outgoing
  const incomingList = transactions.filter((t) => t.type === 'incoming');
  const outgoingList = transactions.filter((t) => t.type === 'outgoing');

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Financial Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Welcome back, <strong className="text-slate-700">{user?.name}</strong>. Here is your financial overview.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchData(filter, true)}
                disabled={refreshing}
                title="Refresh calculations"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
              </button>

              <button
                onClick={() => openModal('incoming')}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02]"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>+ Add Incoming</span>
              </button>

              <button
                onClick={() => openModal('outgoing')}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all hover:scale-[1.02]"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>+ Add Outgoing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top 3 KPI Cards: Total Incoming, Total Outgoing, Total Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Incoming (Green) */}
          <StatCard
            title="Total Incoming"
            amount={summary.totalIncoming}
            type="incoming"
            count={summary.incomingCount}
            subtitle="Money received"
          />

          {/* Total Outgoing (Red) */}
          <StatCard
            title="Total Outgoing"
            amount={summary.totalOutgoing}
            type="outgoing"
            count={summary.outgoingCount}
            subtitle="Money spent"
          />

          {/* Total Balance (Blue) */}
          <StatCard
            title="Total Net Balance"
            amount={summary.totalBalance}
            type="balance"
            count={summary.totalCount}
            subtitle="Incoming - Outgoing"
          />
        </div>

        {/* Date Filter Bar */}
        <FilterBar activeFilter={filter} onFilterChange={handleFilterChange} />

        {/* Content: Recent Incoming List and Recent Outgoing List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500">Calculating your financial records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incoming List */}
            <TransactionList
              title="Recent Incoming"
              type="incoming"
              transactions={incomingList}
              onDelete={handleDeleteTransaction}
              onAddNew={() => openModal('incoming')}
              isDeletingId={isDeletingId}
            />

            {/* Recent Outgoing List */}
            <TransactionList
              title="Recent Outgoing"
              type="outgoing"
              transactions={outgoingList}
              onDelete={handleDeleteTransaction}
              onAddNew={() => openModal('outgoing')}
              isDeletingId={isDeletingId}
            />
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <TransactionFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default DashboardPage;
