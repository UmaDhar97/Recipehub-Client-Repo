import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiImage, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', image: user?.image || '' });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.image || '');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === 'image') setPreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    setLoading(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update your personal information</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6"
      >
        {/* Avatar Preview */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${form.name}&background=e85d04&color=fff&size=128`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${form.name}&background=e85d04&color=fff&size=128`; }}
            />
            {user?.isPremium && (
              <div className="absolute -bottom-1 -right-1">
                <span className="badge-premium text-xs">PRO</span>
              </div>
            )}
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="name" value={form.name} onChange={handleChange}
                required className="input-field pl-10" placeholder="Your full name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profile Photo URL</label>
            <div className="relative">
              <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="url" name="image" value={form.image} onChange={handleChange}
                className="input-field pl-10" placeholder="https://example.com/photo.jpg" />
            </div>
          </div>

          {/* Read-only info */}
          <div className="bg-gray-50 dark:bg-dark-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Account Info</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Email</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Account Type</span>
              <span className={`font-semibold ${user?.isPremium ? 'text-yellow-500' : 'text-gray-900 dark:text-white'}`}>
                {user?.isPremium ? '⭐ Premium' : 'Free'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Role</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">{user?.role}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}