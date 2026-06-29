import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiBookmark, FiFlag, FiClock, FiUser, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ReportModal from '../components/ReportModal.jsx';

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const r = res.data.recipe;
        setRecipe(r);
        setLikesCount(r.likesCount || 0);
        if (user) setLiked(r.likedBy?.includes(user.email));

        if (user) {
          const favRes = await api.get(`/favorites/check/${id}`);
          setIsFavorite(favRes.data.isFavorite);
        }
      } catch {
        toast.error('Recipe not found.');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like recipes.');
    setActionLoading('like');
    try {
      const res = await api.patch(`/recipes/${id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch { toast.error('Failed to update like.'); }
    finally { setActionLoading(''); }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error('Please login to save favorites.');
    setActionLoading('fav');
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites.');
      } else {
        await api.post('/favorites', { recipeId: id });
        setIsFavorite(true);
        toast.success('Added to favorites!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating favorites.');
    }
    finally { setActionLoading(''); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={48} />
    </div>
  );

  if (!recipe) return null;

  const difficultyColors = { Easy: 'text-green-600 bg-green-100', Medium: 'text-yellow-600 bg-yellow-100', Hard: 'text-red-600 bg-red-100' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-6 transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Recipes
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card overflow-hidden"
            >
              <div className="relative h-64 sm:h-80">
                <img
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://placehold.co/800x400/f97316/fff?text=Recipe'; }}
                />
                {recipe.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="badge-premium">⭐ Featured</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {recipe.category}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[recipe.difficultyLevel]}`}>
                    {recipe.difficultyLevel}
                  </span>
                </div>

                <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {recipe.recipeName}
                </h1>

                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <FiUser className="text-brand-500" />
                    {recipe.authorName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MdRestaurant className="text-brand-500" />
                    {recipe.cuisineType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-brand-500" />
                    {recipe.preparationTime} minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiHeart className="text-red-400" />
                    {likesCount} likes
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {ing}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {recipe.instructions}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-4">
            {/* Like / Fav / Report */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-5 space-y-3"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Actions</h3>

              <button
                onClick={handleLike}
                disabled={actionLoading === 'like'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                  liked
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
                    : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-600'
                }`}
              >
                <FiHeart className={liked ? 'fill-red-500 text-red-500' : ''} />
                {liked ? 'Liked' : 'Like'} ({likesCount})
              </button>

              <button
                onClick={handleFavorite}
                disabled={actionLoading === 'fav'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                  isFavorite
                    ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950/30 dark:border-brand-700 dark:text-brand-400'
                    : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <FiBookmark className={isFavorite ? 'fill-brand-500 text-brand-500' : ''} />
                {isFavorite ? 'Saved' : 'Save to Favorites'}
              </button>

              {user && (
                <button
                  onClick={() => setReportOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 dark:border-dark-border text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-all"
                >
                  <FiFlag /> Report Recipe
                </button>
              )}
            </motion.div>

            {/* Recipe Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide mb-4">Recipe Info</h3>
              <dl className="space-y-3">
                {[
                  { label: 'Category', value: recipe.category },
                  { label: 'Cuisine', value: recipe.cuisineType },
                  { label: 'Difficulty', value: recipe.difficultyLevel },
                  { label: 'Prep Time', value: `${recipe.preparationTime} min` },
                  { label: 'Ingredients', value: `${recipe.ingredients?.length} items` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-5"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide mb-3">Chef</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <FiUser className="text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{recipe.authorName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{recipe.authorEmail}</p>
                </div>
              </div>
            </motion.div>

            {!user && (
              <div className="card p-5 text-center border-2 border-dashed border-brand-200 dark:border-brand-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Login to like, save, and interact with this recipe</p>
                <Link to="/login" className="btn-primary text-sm w-full block">Login Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {reportOpen && (
          <ReportModal
            recipeId={id}
            onClose={() => setReportOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}