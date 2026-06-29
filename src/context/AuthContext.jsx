import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase.js';
import api from '../utils/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('rh_token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get('/auth/me');
        const userData = res.data.user;
        setUser(userData);
        localStorage.setItem('rh_user', JSON.stringify(userData));
      } catch {
        localStorage.removeItem('rh_token');
        localStorage.removeItem('rh_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, user: userData } = res.data;
    localStorage.setItem('rh_token', token);
    localStorage.setItem('rh_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const { token, user: userData } = res.data;
  localStorage.setItem('rh_token', token);
  localStorage.setItem('rh_user', JSON.stringify(userData));
  setUser(userData);
  console.log('User role:', userData.role);
  return res.data;
};

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;
    const res = await api.post('/auth/google', {
      name: displayName,
      email,
      image: photoURL
    });
    const { token, user: userData } = res.data;
    localStorage.setItem('rh_token', token);
    localStorage.setItem('rh_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      await signOut(auth);
    } catch {}
    localStorage.removeItem('rh_token');
    localStorage.removeItem('rh_user');
    setUser(null);
  };

  const updateUser = useCallback((updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('rh_user', JSON.stringify(merged));
  }, [user]);

  const isAdmin = user?.role === 'admin';
  const isPremium = user?.isPremium;

  return (
    <AuthContext.Provider value={{
      user, loading, register, login, googleLogin, logout,
      updateUser, isAdmin, isPremium
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);