import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiHeart, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes/user/mine');
      setRecipes(res.data.recipes);
    } catch { toast.error('Failed to load recipes.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r._id !== id));
      toast.success('Recipe deleted.');
    } catch { toast.error('Failed to delete.'); }
    finally { setDeletingId(null); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={48} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Recipes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} published</p>
        </div>
        <Link to="/dashboard/add-recipe" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="card p-12 text-center">
          <div className="text-5xl mb-4">🍳</div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No recipes yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Share your first recipe with the community!</p>
          <Link to="/dashboard/add-recipe" className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> Create Your First Recipe
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe, i) => (
            <motion.div key={recipe._id}
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
                {recipe.isFeatured && (
                  <div className="absolute top-2 right-2">
                    <span className="badge-premium text-xs">⭐ Featured</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{recipe.recipeName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{recipe.cuisineType}</p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><FiHeart className="text-red-400" /> {recipe.likesCount || 0}</span>
                  <span className="flex items-center gap-1"><FiClock className="text-brand-400" /> {recipe.preparationTime}m</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    recipe.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-700' :
                    recipe.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>{recipe.difficultyLevel}</span>
                </div>

                <div className="flex gap-2">
                  <Link to={`/dashboard/edit-recipe/${recipe._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 transition-all">
                    <FiEdit2 className="text-sm" /> Edit
                  </Link>
                  <button onClick={() => handleDelete(recipe._id)} disabled={deletingId === recipe._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 dark:border-dark-border text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 transition-all disabled:opacity-50">
                    <FiTrash2 className="text-sm" /> {deletingId === recipe._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}