import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiShoppingBag } from 'react-icons/fi';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

export default function PurchasedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/purchased-recipes').then(r => setRecipes(r.data.recipes))
      .catch(() => toast.error('Failed to load purchased recipes.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={48} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Purchased Recipes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{recipes.length} purchased recipe{recipes.length !== 1 ? 's' : ''}</p>
      </div>

      {recipes.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
          <FiShoppingBag className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No purchased recipes</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Explore and purchase exclusive recipes!</p>
          <Link to="/browse" className="btn-primary inline-block">Browse Recipes</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.filter(Boolean).map((recipe, i) => (
            <motion.div key={recipe._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card group"
            >
              <div className="relative overflow-hidden h-40">
                <img src={recipe.recipeImage} alt={recipe.recipeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = 'https://placehold.co/400x200/f97316/fff?text=Recipe'; }} />
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">✓ Purchased</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{recipe.recipeName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{recipe.cuisineType} · {recipe.category}</p>
                <Link to={`/recipes/${recipe._id}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-all">
                  <FiExternalLink /> View Recipe
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}