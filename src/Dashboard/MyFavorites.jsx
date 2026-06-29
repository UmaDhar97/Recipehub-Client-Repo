import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiExternalLink, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    api.get('/favorites').then(r => setFavorites(r.data.favorites)).catch(() => toast.error('Failed to load favorites.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (recipeId) => {
    setRemovingId(recipeId);
    try {
      await api.delete(`/favorites/${recipeId}`);
      setFavorites(prev => prev.filter(f => f.recipeId?._id !== recipeId));
      toast.success('Removed from favorites.');
    } catch { toast.error('Failed to remove.'); }
    finally { setRemovingId(null); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={48} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
          <FiHeart className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Save recipes you love while browsing!</p>
          <Link to="/browse" className="btn-primary inline-block">Browse Recipes</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav, i) => {
            const recipe = fav.recipeId;
            if (!recipe) return null;
            return (
              <motion.div key={fav._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card group"
              >
                <div className="relative overflow-hidden h-40">
                  <img src={recipe.recipeImage} alt={recipe.recipeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'https://placehold.co/400x200/f97316/fff?text=Recipe'; }} />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 text-xs font-semibold px-2 py-1 rounded-full text-gray-700">{recipe.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{recipe.recipeName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{recipe.cuisineType} · {recipe.preparationTime} min</p>
                  <p className="text-xs text-gray-400 mb-4">Saved on {new Date(fav.addedAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Link to={`/recipes/${recipe._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-all">
                      <FiExternalLink className="text-sm" /> View
                    </Link>
                    <button onClick={() => handleRemove(recipe._id)} disabled={removingId === recipe._id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 dark:border-dark-border text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50">
                      <FiTrash2 className="text-sm" /> {removingId === recipe._id ? '...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}