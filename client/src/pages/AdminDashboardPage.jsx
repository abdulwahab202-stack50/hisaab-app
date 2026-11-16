import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  ShieldCheck,
  UserPlus,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Trash2,
  Power,
  RotateCw,
  Search,
  Copy,
  Check,
  DollarSign,
  AlertTriangle,
  X,
  Send,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create Client Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [expiryOption, setExpiryOption] = useState('30_days');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  
  // Created Client Credentials Card (to copy link + login)
  const [latestCreatedClient, setLatestCreatedClient] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extend Expiry Modal / Quick action state
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/clients');
      if (res.data.success) {
        setClients(res.data.clients);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle Create Client
  const handleCreateClient = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!newName || !newEmail || !newPassword) {
      setCreateError('Please fill all required fields');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await api.post('/admin/create-client', {
        name: newName,
        email: newEmail,
        password: newPassword,
        expiryOption,
      });

      if (res.data.success) {
        setLatestCreatedClient({
          name: newName,
          email: newEmail,
          password: newPassword,
          expiryDate: res.data.client.expiryDate,
        });
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setExpiryOption('30_days');
        fetchClients();
      }
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create client');
    } finally {
      setCreateLoading(false);
    }
  };

  // Toggle Active / Deactivate
  const handleToggleStatus = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await api.put(`/admin/toggle-client/${id}`);
      if (res.data.success) {
        setClients((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: res.data.client.isActive } : c))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Extend Expiry
  const handleExtendExpiry = async (id, days) => {
    setActionLoadingId(id);
    try {
      const res = await api.put(`/admin/extend-expiry/${id}`, { days });
      if (res.data.success) {
        fetchClients();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error extending expiry');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Client
  const handleDeleteClient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete client "${name}" and all their financial records?`)) {
      return;
    }

    setActionLoadingId(id);
    try {
      const res = await api.delete(`/admin/clients/${id}`);
      if (res.data.success) {
        setClients((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete client');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Copy Login Invite to Clipboard
  const handleCopyInvite = () => {
    if (!latestCreatedClient) return;
    const loginUrl = `${window.location.origin}/login`;
    const validityText = latestCreatedClient.expiryDate
      ? new Date(latestCreatedClient.expiryDate).toLocaleDateString()
      : 'Permanent / Lifetime Access (No Expiry)';
    const inviteText = `Hi ${latestCreatedClient.name},\nHere are your access details for Hisab App:\n\n🔗 Web App Link: ${loginUrl}\n📧 Email: ${latestCreatedClient.email}\n🔑 Password: ${latestCreatedClient.password}\n\nValid until: ${validityText}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  // Calculate metrics
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.isActive && !c.isExpired).length;
  const expiredClients = clients.filter((c) => !c.isActive || c.isExpired).length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Admin Client Management Console
                </h1>
                <p className="text-xs text-slate-500">
                  Provision client licenses, track expiry, and control access permissions.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setLatestCreatedClient(null);
                setCreateModalOpen(true);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Create New Client</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Clients</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalClients}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Active & Valid</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{activeClients}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-rose-700 tracking-wider">Expired / Disabled</p>
              <h3 className="text-2xl font-extrabold text-rose-700 mt-1">{expiredClients}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Client Access Deployment Notice */}
        <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Secure Client Access System:</strong> Clients only receive the deployed link + login credentials. They never receive source code.
            </span>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients by name or email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={fetchClients}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors self-end sm:self-auto"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-500">Loading client directory...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold">No clients found</p>
              <p className="text-xs text-slate-400 mt-1">Create your first client using the button above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                    <th className="py-3.5 px-4">Client Name & Email</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">License Expiry</th>
                    <th className="py-3.5 px-4">Financials</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((client) => {
                    const isClientExpired = client.isExpired || (client.expiryDate && new Date(client.expiryDate) < new Date());
                    const isBusy = actionLoadingId === client._id;

                    return (
                      <tr key={client._id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
                              {client.name?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{client.name}</p>
                              <p className="text-[11px] text-slate-400">{client.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {client.isActive ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold bg-slate-200 text-slate-700 text-[11px]">
                              <XCircle className="w-3 h-3" />
                              <span>Deactivated</span>
                            </span>
                          )}
                        </td>

                        {/* Expiry Date */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            {client.isPermanent || !client.expiryDate ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span>♾️ Permanent (Lifetime)</span>
                              </span>
                            ) : (
                              <>
                                <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{new Date(client.expiryDate).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  {isClientExpired ? (
                                    <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                      Expired
                                    </span>
                                  ) : (
                                    <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                                      {client.daysRemaining} days remaining
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Financials (Transactions logged) */}
                        <td className="py-3.5 px-4">
                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <p>
                              <strong className="text-slate-800">{client.totalTransactions || 0}</strong> records
                            </p>
                            <p className="font-semibold text-slate-800">
                              Balance: ${(client.balance || 0).toLocaleString()}
                            </p>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Activate / Deactivate Toggle */}
                            <button
                              onClick={() => handleToggleStatus(client._id)}
                              disabled={isBusy}
                              title={client.isActive ? 'Deactivate access' : 'Activate access'}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                client.isActive
                                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {client.isActive ? 'Deactivate' : 'Activate'}
                            </button>

                            {/* Extend Expiry Quick Buttons */}
                            <div className="inline-flex rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
                              <button
                                onClick={() => handleExtendExpiry(client._id, 7)}
                                disabled={isBusy}
                                title="Extend access by 7 days"
                                className="px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 border-r border-slate-200 transition-colors"
                              >
                                +7D
                              </button>
                              <button
                                onClick={() => handleExtendExpiry(client._id, 30)}
                                disabled={isBusy}
                                title="Extend access by 30 days"
                                className="px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-50 border-r border-slate-200 transition-colors"
                              >
                                +30D
                              </button>
                              <button
                                onClick={() => handleExtendExpiry(client._id, 'permanent')}
                                disabled={isBusy}
                                title="Set Lifetime Permanent Access"
                                className="px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                ♾️ Lifetime
                              </button>
                            </div>

                            {/* Delete Client */}
                            <button
                              onClick={() => handleDeleteClient(client._id, client.name)}
                              disabled={isBusy}
                              title="Delete client and their transactions"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create New Client Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            {/* Header */}
            <div className="p-5 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Create New Client</h3>
                  <p className="text-xs text-white/80">Generate portal access for client</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Client was just created, show copyable credentials box */}
            {latestCreatedClient ? (
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <p className="font-bold flex items-center space-x-1.5 text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Client Created Successfully!</span>
                  </p>
                  <p className="text-emerald-700">
                    Share the login details with your client. They will only access the web interface.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">Login URL:</span>
                    <p className="text-blue-600 font-semibold">{window.location.origin}/login</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="text-slate-800 font-semibold">{latestCreatedClient.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Password:</span>
                    <p className="text-slate-800 font-semibold">{latestCreatedClient.password}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Expiry Date:</span>
                    <p className="text-slate-800">
                      {new Date(latestCreatedClient.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleCopyInvite}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Invite Details'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setLatestCreatedClient(null);
                      setCreateModalOpen(false);
                    }}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateClient} className="p-6 space-y-4">
                {createError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {createError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Acme Corp / Sarah"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Provide a temporary password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                  />
                </div>

                {/* Expiry Option */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Initial License Period
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setExpiryOption('7_days')}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        expiryOption === '7_days'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      <span>7-Day Trial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpiryOption('30_days')}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        expiryOption === '30_days'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Calendar className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span>30-Day License</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpiryOption('permanent')}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        expiryOption === 'permanent'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base block mb-0.5">♾️</span>
                      <span>Lifetime</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
                  >
                    {createLoading && (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span>Create Client</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
