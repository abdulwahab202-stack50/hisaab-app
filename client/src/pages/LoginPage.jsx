import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Lock, Mail, AlertTriangle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpiredError, setIsExpiredError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsExpiredError(false);

    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
      if (result.isExpired || result.message?.toLowerCase().includes('expired')) {
        setIsExpiredError(true);
      }
    }
  };

  // Helper to quickly fill demo credentials
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsExpiredError(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Hisab<span className="text-blue-600">App</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your login credentials to access your financial dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80">
          
          {/* Expired / Blocked Alert */}
          {error && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
                isExpiredError
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Access Denied</p>
                <p className="mt-0.5">{error}</p>
                {isExpiredError && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-semibold bg-rose-100/70 p-2 rounded-lg">
                    🔒 Your subscription or trial license has expired. Please contact your system administrator to renew or extend your access.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Hisab</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Fill Box */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
              Quick Test Accounts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('client@hisab.com', 'client123')}
                className="p-2 text-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
                <span>Client Demo</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@hisab.com', 'admin123')}
                className="p-2 text-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-600" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('expired@hisab.com', 'expired123')}
                className="p-2 text-center rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition-colors"
                title="Test the access expiry requirement"
              >
                <AlertTriangle className="w-3.5 h-3.5 mx-auto mb-1 text-rose-600" />
                <span>Test Expired</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">
              Sign up for 30-day trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
