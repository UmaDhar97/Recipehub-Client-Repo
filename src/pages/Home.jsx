import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { FaFire, FaStar, FaUsers } from 'react-icons/fa';
import api from '../utils/api.js';
import RecipeCard from '../components/RecipeCard.jsx';
import { SkeletonGrid } from '../components/LoadingSpinner.jsx';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Vegan', 'Beverage'];

const stats = [
  { icon: FaFire, value: '10K+', label: 'Recipes Shared' },
  { icon: FaUsers, value: '50K+', label: 'Active Chefs' },
  { icon: FaStar, value: '4.9', label: 'Average Rating' },
  { icon: MdVerified, value: '200+', label: 'Cuisines Covered' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/recipes/featured').then(r => setFeatured(r.data.recipes)).catch(() => {}).finally(() => setLoadingFeatured(false));
    api.get('/recipes/popular').then(r => setPopular(r.data.recipes)).catch(() => {}).finally(() => setLoadingPopular(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-dark-bg dark:to-gray-900 overflow-hidden">
        {/* BG Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200 dark:bg-brand-900/20 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <FaFire /> The #1 Recipe Sharing Platform
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Cook, Share &{' '}
                <span className="text-gradient">Inspire</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                Discover thousands of recipes from passionate home chefs. Share your culinary creations and connect with food lovers worldwide.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search recipes, cuisines..."
                    className="input-field pl-12 text-base"
                  />
                </div>
                <button type="submit" className="btn-primary px-6 whitespace-nowrap">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">Popular:</span>
                {['Pasta', 'Sushi', 'Tacos', 'Curry'].map(tag => (
                  <Link
                    key={tag}
                    to={`/browse?search=${tag}`}
                    className="text-xs bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full hover:border-brand-400 hover:text-brand-600 transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/browse" className="btn-primary inline-flex items-center gap-2 text-base">
                  Browse Recipes <FiArrowRight />
                </Link>
                <Link to="/register" className="btn-outline inline-flex items-center gap-2 text-base">
                  Share Your Recipe
                </Link>
              </div>
            </motion.div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=200&fit=crop',
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
                'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop',
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`rounded-2xl overflow-hidden shadow-lg ${i === 0 || i === 3 ? 'row-span-2' : ''}`}
                >
                  <img src={src} alt="Food" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-brand-600 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center text-white">
                <Icon className="text-3xl mx-auto mb-2 text-orange-200" />
                <div className="font-display text-3xl font-bold">{value}</div>
                <div className="text-orange-100 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── FEATURED RECIPES ── */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Curated Picks</span>
            <h2 className="section-title mt-2">Featured Recipes</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Handpicked by our editorial team — the recipes everyone's talking about.
            </p>
          </motion.div>

          {loadingFeatured ? (
            <SkeletonGrid count={6} />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((recipe, i) => <RecipeCard key={recipe._id} recipe={recipe} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p>No featured recipes yet. Check back soon!</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/browse" className="btn-outline inline-flex items-center gap-2">
              View All Recipes <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Browse By Type</span>
            <h2 className="section-title mt-2">Explore Categories</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/browse?category=${cat}`}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-dark-border hover:border-brand-300 hover:shadow-md transition-all text-center group"
                >
                  <span className="text-2xl">
                    {['🍳', '🥗', '🍽️', '🥨', '🍰', '🥦', '🍹'][i]}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">{cat}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR RECIPES ── */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Community Favorites</span>
            <h2 className="section-title mt-2">Most Popular Recipes</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Loved by thousands of food enthusiasts in our community.
            </p>
          </motion.div>

          {loadingPopular ? (
            <SkeletonGrid count={6} />
          ) : popular.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular.slice(0, 6).map((recipe, i) => <RecipeCard key={recipe._id} recipe={recipe} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p>Be the first to share a recipe!</p>
              <Link to="/dashboard/add-recipe" className="btn-primary mt-4 inline-block">Share Now</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Simple Steps</span>
            <h2 className="section-title mt-2">How RecipeHub Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and set up your chef profile to start sharing with the community.', emoji: '👤' },
              { step: '02', title: 'Share Your Recipes', desc: 'Add your favorite recipes with photos, ingredients, and step-by-step instructions.', emoji: '📝' },
              { step: '03', title: 'Discover & Connect', desc: 'Explore thousands of recipes, save favorites, and engage with fellow food lovers.', emoji: '🌍' },
            ].map(({ step, title, desc, emoji }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white dark:bg-dark-bg rounded-2xl p-8 border border-gray-100 dark:border-dark-border text-center"
              >
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
                  {emoji}
                </div>
                <div className="absolute top-4 right-4 text-5xl font-display font-black text-gray-100 dark:text-gray-800">{step}</div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
              Ready to Share Your Culinary Story?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ home chefs already sharing their passion for food on RecipeHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-all inline-flex items-center gap-2">
                Start Free Today <FiArrowRight />
              </Link>
              <Link to="/browse" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                Explore Recipes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}