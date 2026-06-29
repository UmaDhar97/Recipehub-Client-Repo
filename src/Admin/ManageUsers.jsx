import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiShield, FiUserX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [actionId, setActionId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { page, limit: 10, search } });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleBlock = async (id, isBlocked) => {
    setActionId(id);
    try {
      await api.patch(`/admin/users/${id}/block`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'}.`);
    } catch { toast.error('Action failed.'); }
    finally { setActionId(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage all registered users</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..." className="input-field pl-10" />
      </div>

      {loading ? <div className="flex justify-center py-10"><LoadingSpinner size={40} /></div> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-dark-border">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Premium', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=e85d04&color=fff`}
                          alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-300'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>{u.isBlocked ? 'Blocked' : 'Active'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.isPremium ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400'
                      }`}>{u.isPremium ? '⭐ Premium' : 'Free'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleBlock(u._id, u.isBlocked)} disabled={actionId === u._id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                            u.isBlocked
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                          {u.isBlocked ? <><FiShield /> Unblock</> : <><FiUserX /> Block</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-dark-border">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} users
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