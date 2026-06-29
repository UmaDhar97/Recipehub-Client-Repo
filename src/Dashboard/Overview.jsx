import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiHeart, FiThumbsUp, FiPlusCircle, FiStar } from 'react-icons/fi';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stats')
      .then(r => setStats(r.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'My Recipes', value: stats?.totalRecipes ?? 0, icon: FiBookOpen, color: 'bg-blue-500', link: '/dashboard/my-recipes' },
    { label: 'Favorites', value: stats?.totalFavorites ?? 0, icon: FiHeart, color: 'bg-red-500', link: '/dashboard/favorites' },
    { label: 'Total Likes Received', value: stats?.totalLikes ?? 0, icon: FiThumbsUp, color: 'bg-green-500', link: '/dashboard/my-recipes' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your recipes.</p>
      </motion.div>

      {/* Premium Banner */}
      {!user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiStar className="text-white" />
              <span className="font-bold text-white">Upgrade to Premium</span>
            </div>
            <p className="text-yellow-100 text-sm">You can add only 2 recipes on free plan. Upgrade for unlimited recipes!</p>
          </div>
          <Link to="/dashboard/premium" className="shrink-0 bg-white text-orange-600 font-bold px-5 py-2 rounded-xl text-sm hover:bg-orange-50 transition-all">
            Upgrade Now
          </Link>
        </motion.div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statCards.map(({ label, value, icon: Icon, color, link }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            >
              <Link to={link} className="card p-6 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all block group">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/dashboard/add-recipe" className="card p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group border-2 border-dashed border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/10">
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center group-hover:bg-brand-200 transition-colors">
              <FiPlusCircle className="text-brand-600 text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Add New Recipe</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Share your culinary creation</p>
            </div>
          </Link>
          <Link to="/browse" className="card p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FiBookOpen className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Browse Recipes</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discover new dishes</p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Recipe Limit */}
      {!user?.isPremium && stats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Recipe Limit (Free Plan)</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{stats.totalRecipes}/2 used</span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${stats.totalRecipes >= 2 ? 'bg-red-500' : 'bg-brand-500'}`}
              style={{ width: `${Math.min(100, (stats.totalRecipes / 2) * 100)}%` }}
            />
          </div>
          {stats.totalRecipes >= 2 && (
            <p className="text-xs text-red-500 mt-2">Limit reached! <Link to="/dashboard/premium" className="font-semibold underline">Upgrade to Premium</Link> to add unlimited recipes.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}