import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="card p-10 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheck className="text-green-600 text-4xl" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Welcome to <span className="font-bold text-brand-600">RecipeHub Premium</span>!
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
            Your account has been upgraded. You can now add unlimited recipes and enjoy all premium benefits.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 text-left space-y-2">
            {['Unlimited recipe uploads', 'Premium badge on your profile', 'Priority support access'].map(perk => (
              <div key={perk} className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                <span>⭐</span> {perk}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/dashboard/add-recipe" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              Add Your First Recipe <FiArrowRight />
            </Link>
            <Link to="/dashboard" className="btn-ghost w-full py-3 border border-gray-200 dark:border-dark-border">
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}