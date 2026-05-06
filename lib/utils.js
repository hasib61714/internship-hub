import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '—';
  return '৳' + Number(amount).toLocaleString('en-IN');
}

export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(date) {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const STATUS_COLORS = {
  pending:     'bg-yellow-100 text-yellow-700',
  reviewing:   'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  accepted:    'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
  active:      'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-600',
  paused:      'bg-orange-100 text-orange-700',
};

export const JOB_TYPE_COLORS = {
  internship: 'bg-blue-100 text-blue-700',
  'full-time':'bg-green-100 text-green-700',
  'part-time':'bg-purple-100 text-purple-700',
  hourly:     'bg-orange-100 text-orange-700',
  project:    'bg-indigo-100 text-indigo-700',
};
