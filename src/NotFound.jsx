import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Illustration */}
        <div className="text-9xl mb-6">🍽️</div>
        <div className="font-display text-8xl font-black text-brand-600 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! Looks like this recipe got lost in the kitchen. The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 text-base px-8"
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}