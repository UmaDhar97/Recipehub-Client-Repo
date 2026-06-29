import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiUsers, FiBookOpen, FiFlag,
  FiDollarSign, FiMenu, FiLogOut
} from 'react-icons/fi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: FiHome, label: 'Overview', end: true },
  { to: '/admin/users', icon: FiUsers, label: 'Manage Users' },
  { to: '/admin/recipes', icon: FiBookOpen, label: 'Manage Recipes' },
  { to: '/admin/reports', icon: FiFlag, label: 'Reports' },
  { to: '/admin/transactions', icon: FiDollarSign, label: 'Transactions' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out!');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 dark:border-dark-border">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
            <MdOutlineRestaurantMenu className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-gray-900 dark:text-white">RecipeHub</span>
            <span className="block text-xs text-red-500 font-semibold">Admin Panel</span>
          </div>
        </NavLink>
      </div>

      <div className="p-4 border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=e85d04&color=fff`}
            alt={user?.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-red-200" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-0.5 rounded-full font-semibold">Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon className="text-lg shrink-0" /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-dark-border space-y-1">
        <NavLink to="/" className="sidebar-link">
          <span className="text-lg">🏠</span><span>Go to Site</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600">
          <FiLogOut className="text-lg" /><span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg overflow-hidden">
      <aside className="hidden lg:flex lg:w-64 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border flex-col shrink-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-dark-card z-50 lg:hidden flex flex-col">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border">
            <FiMenu className="text-xl" />
          </button>
          <span className="font-display font-bold text-gray-900 dark:text-white">Admin Panel</span>
          <div className="w-9" />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}