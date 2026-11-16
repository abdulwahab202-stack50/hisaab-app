import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Scale, TrendingUp } from 'lucide-react';

const StatCard = ({ title, amount, type, count, subtitle }) => {
  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const getCardStyle = () => {
    switch (type) {
      case 'incoming':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white',
          border: 'border-emerald-200/80',
          textColor: 'text-emerald-700',
          iconBg: 'bg-emerald-600',
          iconColor: 'text-white',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          icon: <ArrowDownLeft className="w-6 h-6" />,
        };
      case 'outgoing':
        return {
          cardBg: 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white',
          border: 'border-rose-200/80',
          textColor: 'text-rose-700',
          iconBg: 'bg-rose-600',
          iconColor: 'text-white',
          badgeBg: 'bg-rose-100 text-rose-800',
          icon: <ArrowUpRight className="w-6 h-6" />,
        };
      case 'balance':
      default:
        return {
          cardBg: 'bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-white',
          border: 'border-blue-200/80',
          textColor: amount < 0 ? 'text-rose-600' : 'text-blue-700',
          iconBg: 'bg-blue-600',
          iconColor: 'text-white',
          badgeBg: 'bg-blue-100 text-blue-800',
          icon: <Scale className="w-6 h-6" />,
        };
    }
  };

  const style = getCardStyle();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.cardBg} p-6 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
          {title}
        </span>
        <div
          className={`w-11 h-11 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center shadow-md`}
        >
          {style.icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className={`text-3xl font-extrabold tracking-tight ${style.textColor}`}>
          {formatCurrency(amount)}
        </div>
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>{subtitle || 'Updated just now'}</span>
          {count !== undefined && (
            <span className={`px-2 py-0.5 rounded-full font-semibold ${style.badgeBg}`}>
              {count} {count === 1 ? 'record' : 'records'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
