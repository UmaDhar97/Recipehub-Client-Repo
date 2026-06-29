import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiHeart, FiUser } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function RecipeCard({ recipe, index = 0 }) {
  if (!recipe) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card-hover group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={recipe.recipeImage}
          alt={recipe.recipeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x250/f97316/fff?text=Recipe'; }}
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 dark:bg-black/70 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 dark:text-gray-200">
            {recipe.category}
          </span>
        </div>
        {recipe.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {recipe.recipeName}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <MdRestaurant className="text-brand-500" />
            {recipe.cuisineType}
          </span>
          <span className="flex items-center gap-1">
            <FiClock className="text-brand-500" />
            {recipe.preparationTime} min
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[recipe.difficultyLevel] || ''}`}>
            {recipe.difficultyLevel}
          </span>
        </div>

        {/* Author + Likes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FiUser className="text-gray-400 text-xs" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{recipe.authorName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FiHeart className="text-red-400" />
            <span>{recipe.likesCount || 0}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/recipes/${recipe._id}`}
          className="mt-4 block text-center bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95"
        >
          View Recipe
        </Link>
      </div>
    </motion.div>
  );
}