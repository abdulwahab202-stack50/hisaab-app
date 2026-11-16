import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Clock,
  Menu,
  X,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate days remaining for client
  const getDaysRemaining = () => {
    if (!user || user.role === 'admin' || !user.expiryDate) return null;
    const now = new Date();
    const expiry = new Date(user.expiryDate);
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = getDaysRemaining();

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Hisab<span className="text-blue-600">App</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Finance & Clients
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActivePath('/dashboard')
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActivePath('/admin')
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Expiry / Lifetime Pill for Client */}
                {!isAdmin && (
                  !user?.expiryDate ? (
                    <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-semibold shadow-xs">
                      <span>♾️ Lifetime Access</span>
                    </div>
                  ) : daysLeft !== null ? (
                    <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{daysLeft} days access left</span>
                    </div>
                  ) : null
                )}

                {/* User info */}
                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center space-x-2 px-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                    {user?.name?.substring(0, 2) || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{user?.name}</p>
                    <span className="capitalize text-[11px] font-medium text-slate-500">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Pricing
                </a>
                <div className="h-5 w-px bg-slate-200 mx-2"></div>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 transition-all hover:scale-[1.02]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.substring(0, 2) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              {!isAdmin && (
                !user?.expiryDate ? (
                  <div className="flex items-center space-x-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold mb-2 border border-emerald-200">
                    <span>♾️ Permanent / Lifetime Member</span>
                  </div>
                ) : daysLeft !== null ? (
                  <div className="flex items-center space-x-2 p-2 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold mb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{daysLeft} days access left</span>
                  </div>
                ) : null
              )}

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <span className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Dashboard</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
                >
                  <span className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin Panel</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-2 flex items-center space-x-2 p-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Pricing
              </a>
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Get Started Free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
