import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiFlag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const REASONS = ['Spam', 'Offensive Content', 'Copyright Issue', 'Misleading', 'Other'];

export default function ReportModal({ recipeId, onClose }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Please select a reason.');
    setLoading(true);
    try {
      await api.post('/reports', { recipeId, reason, description });
      toast.success('Recipe reported. Thank you!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FiFlag className="text-orange-500" />
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Report Recipe</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border text-gray-400 transition-colors">
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason *</label>
              <div className="space-y-2">
                {REASONS.map(r => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={e => setReason(e.target.value)}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Details (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide more context..."
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-gray-200 dark:border-dark-border">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 bg-orange-500 hover:bg-orange-600">
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}