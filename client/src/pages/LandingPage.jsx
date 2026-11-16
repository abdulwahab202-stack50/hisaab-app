import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  Sliders,
  DollarSign,
  Lock,
  Zap,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Hisab App v2.0 • Secure Money Tracking & Client Access System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Master Your Cash Flow & Manage Client Access with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Total Control
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The all-in-one financial bookkeeping platform for freelancers, agencies, and businesses.
            Track incoming cash, monitor outgoing expenses, and manage licensed client accounts effortlessly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Start 30-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Login to Your Hisab</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Full privacy isolation per client</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Automated timestamps & date filtering</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Product Highlight Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 mb-20">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-4">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-emerald-400">Green for Incoming</h3>
              <p className="text-xs text-slate-400 mt-1">Instant tracking of client payments, retainers, and revenues</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-rose-400">Red for Outgoing</h3>
              <p className="text-xs text-slate-400 mt-1">Keep overhead, vendor payouts, and operational expenses in check</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-blue-400">Blue for Total Balance</h3>
              <p className="text-xs text-slate-400 mt-1">Automatic real-time calculation with zero delay</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">Core Features</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for precision, speed, and client control
            </p>
            <p className="mt-3 text-slate-600 text-sm">
              Everything you need to run your business bookkeeping and license client access securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Live Financial Summary</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Top KPI cards showing Total Incoming, Total Outgoing, and Net Balance with immediate mathematical precision.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Intelligent Date Filters</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Switch between Today, This Week (Last 7 Days), Last Week, and This Month with a single click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Admin Client Management</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Generate licensed client logins, set 7-day or 30-day trials, toggle active status, or extend expiry dates dynamically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Automatic Expiry Control</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Expired accounts are immediately locked with clear alerts to contact admin for renewal, protecting your business model.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Total Privacy Isolation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Each client strictly sees only their own transactions. Financial records are segregated by user ID.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Automated Timestamps</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every transaction automatically stamps exact date and time. No manual date pickers needed unless specified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">Flexible Pricing</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Start with a trial, upgrade as you grow
            </p>
            <p className="mt-3 text-slate-600 text-sm">
              Simple and transparent plans for clients and organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 7 Days Trial */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Evaluation</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">7-Day Free Trial</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="ml-1 text-xs text-slate-500">/ 7 days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Perfect for checking out all features risk-free.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Unlimited transaction logging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Income, Expense & Balance Cards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>All timeframe filters</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 block w-full py-2.5 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                Sign Up for Trial
              </Link>
            </div>

            {/* 30 Days Pro */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Standard Access</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Monthly License</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">$19</span>
                  <span className="ml-1 text-xs text-slate-500">/ 30 days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Full personal or business accounting suite.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>All 7-day features included</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Dedicated account isolation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Fast cloud data persistence</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>One-click expiry extension by Admin</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 block w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Client Management */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Admin License</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Agency & Admin</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">$49</span>
                  <span className="ml-1 text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Manage unlimited client portals & billing access.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Admin Central Dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Create & Provision Clients</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Activate / Deactivate instantly</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Clients get deployed link + login only</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/login"
                className="mt-8 block w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Admin Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">Hisab App</span>
            <span>— Money Tracker & Client Management System</span>
          </div>
          <p>© {new Date().getFullYear()} Hisab App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
