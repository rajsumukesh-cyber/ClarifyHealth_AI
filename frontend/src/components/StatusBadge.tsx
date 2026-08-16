import React from 'react';
import { TermStatus } from '../types';
import { CheckCircle2, TrendingUp, TrendingDown, HelpCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: TermStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase().trim();

  let label = 'Within Reference Range';
  let classes = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  let Icon = CheckCircle2;

  if (normalized === 'high') {
    label = 'Higher Than Standard Range';
    classes = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    Icon = TrendingUp;
  } else if (normalized === 'low') {
    label = 'Lower Than Standard Range';
    classes = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    Icon = TrendingDown;
  } else if (normalized === 'needs_attention' || normalized === 'abnormal') {
    label = 'Outside Range — Review with Doctor';
    classes = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    Icon = AlertTriangle;
  } else if (normalized === 'info_unavailable' || normalized === 'unclear') {
    label = 'Reference Info Unavailable';
    classes = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    Icon = HelpCircle;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${classes} ${sizeClasses} transition-colors`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 flex-shrink-0'} />
      <span>{label}</span>
    </span>
  );
};
