import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFlag, FiTrash2, FiXCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [actionId, setActionId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports', { params: { page, limit: 10 } });
      setReports(res.data.reports);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load reports.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [page]);

  const handleDismiss = async (id) => {
    setActionId(id + 'd');
    try {
      await api.patch(`/admin/reports/${id}/dismiss`);
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'dismissed' } : r));
      toast.success('Report dismissed.');
    } catch { toast.error('Failed.'); }
    finally { setActionId(null); }
  };

  const handleRemoveRecipe = async (id) => {
    if (!window.confirm('Remove this recipe? This cannot be undone.')) return;
    setActionId(id + 'r');
    try {
      await api.patch(`/admin/reports/${id}/remove-recipe`);
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'reviewed' } : r));
      toast.success('Recipe removed and report resolved.');
    } catch { toast.error('Failed.'); }
    finally { setActionId(null); }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    reviewed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dismissed: 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Recipe Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and action user-submitted reports</p>
      </div>

      {loading ? <div className="flex justify-center py-10"><LoadingSpinner size={40} /></div> : (
        reports.length === 0 ? (
          <div className="card p-12 text-center">
            <FiFlag className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No reports</h3>
            <p className="text-gray-500 dark:text-gray-400">All clear! No pending reports.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-dark-border">
                  <tr>
                    {['Recipe', 'Reporter', 'Reason', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {reports.map(r => (
                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {r.recipeId?.recipeImage && (
                            <img src={r.recipeId.recipeImage} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0"
                              onError={e => { e.target.style.display = 'none'; }} />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[120px]">
                            {r.recipeId?.recipeName || 'Deleted Recipe'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{r.reporterEmail}</td>
                      <td className="px-5 py-4">
                        <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2.5 py-1 rounded-full font-medium">{r.reason}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        {r.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleRemoveRecipe(r._id)} disabled={actionId === r._id + 'r'}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-all disabled:opacity-50">
                              <FiTrash2 className="text-xs" /> Remove
                            </button>
                            <button onClick={() => handleDismiss(r._id)} disabled={actionId === r._id + 'd'}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-border dark:text-gray-300 transition-all disabled:opacity-50">
                              <FiXCircle className="text-xs" /> Dismiss
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-all">
                    <FiChevronLeft />
                  </button>
                  <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-all">
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )
      )}
    </div>
  );
}