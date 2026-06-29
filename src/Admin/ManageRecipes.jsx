import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiStar, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [actionId, setActionId] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/recipes', { params: { page, limit: 10, search } });
      setRecipes(res.data.recipes);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load recipes.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecipes(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe permanently?')) return;
    setActionId(id);
    try {
      await api.delete(`/admin/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r._id !== id));
      toast.success('Recipe deleted.');
    } catch { toast.error('Failed to delete.'); }
    finally { setActionId(null); }
  };

  const handleFeature = async (id, isFeatured) => {
    setActionId(id + 'f');
    try {
      await api.patch(`/admin/recipes/${id}/feature`);
      setRecipes(prev => prev.map(r => r._id === id ? { ...r, isFeatured: !isFeatured } : r));
      toast.success(`Recipe ${isFeatured ? 'unfeatured' : 'featured'}!`);
    } catch { toast.error('Failed to update.'); }
    finally { setActionId(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Manage Recipes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View, feature, or delete recipes</p>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search recipes..." className="input-field pl-10" />
      </div>

      {loading ? <div className="flex justify-center py-10"><LoadingSpinner size={40} /></div> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-dark-border">
                <tr>
                  {['Recipe', 'Author', 'Category', 'Likes', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {recipes.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={r.recipeImage} alt={r.recipeName}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                          onError={e => { e.target.src = 'https://placehold.co/40x40/f97316/fff?text=R'; }} />
                        <span className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[160px]">{r.recipeName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{r.authorName}</td>
                    <td className="px-5 py-4">
                      <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs px-2.5 py-1 rounded-full font-medium">{r.category}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300 font-medium">{r.likesCount || 0}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        r.isFeatured ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400'
                      }`}>{r.isFeatured ? '⭐ Featured' : 'Normal'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleFeature(r._id, r.isFeatured)} disabled={actionId === r._id + 'f'}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                            r.isFeatured
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-border dark:text-gray-300'
                              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                          <FiStar className="text-xs" /> {r.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button onClick={() => handleDelete(r._id)} disabled={actionId === r._id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-all disabled:opacity-50">
                          <FiTrash2 className="text-xs" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-dark-border">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} recipes
              </span>
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
      )}
    </div>
  );
}