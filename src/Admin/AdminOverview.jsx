import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiStar, FiFlag, FiDollarSign } from 'react-icons/fi';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.stats)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Recipes', value: stats.totalRecipes, icon: FiBookOpen, color: 'bg-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
    { label: 'Premium Members', value: stats.totalPremium, icon: FiStar, color: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Pending Reports', value: stats.totalReports, icon: FiFlag, color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  ] : [];

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={48} /></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform statistics at a glance</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`text-xl ${color.replace('bg-', 'text-')}`} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/users', label: 'Manage Users', icon: '👥' },
            { href: '/admin/recipes', label: 'Manage Recipes', icon: '📋' },
            { href: '/admin/reports', label: 'View Reports', icon: '🚩' },
            { href: '/admin/transactions', label: 'Transactions', icon: '💳' },
          ].map(({ href, label, icon }) => (
            <a key={href} href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-dark-border hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/10 transition-all text-center group">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">{label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}