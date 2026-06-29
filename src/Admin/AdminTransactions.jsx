import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

export default function AdminTransactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    setLoading(true);
    api.get('/admin/transactions', { params: { page, limit: 10 } })
      .then(r => { setPayments(r.data.payments); setPagination(r.data.pagination); })
      .catch(() => toast.error('Failed to load transactions.'))
      .finally(() => setLoading(false));
  }, [page]);

  const statusColor = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">All payment records on the platform</p>
      </div>

      {loading ? <div className="flex justify-center py-10"><LoadingSpinner size={40} /></div> : (
        payments.length === 0 ? (
          <div className="card p-12 text-center">
            <FiDollarSign className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No transactions yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Payment records will appear here.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-dark-border">
                  <tr>
                    {['User', 'Amount', 'Type', 'Transaction ID', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {payments.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{p.userEmail}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">${p.amount?.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          p.type === 'premium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>{p.type}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">{p.transactionId?.slice(0, 20)}...</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[p.paymentStatus]}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{new Date(p.paidAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} transactions
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
        )
      )}
    </div>
  );
}