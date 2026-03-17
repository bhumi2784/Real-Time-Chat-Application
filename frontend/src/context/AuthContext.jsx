import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/auth/profile');
          setAuthUser(res.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setAuthUser(res.data);
    return res.data;
  };

  const register = async (name, email, password, profilePic) => {
    const res = await api.post('/auth/register', { name, email, password, profilePic });
    localStorage.setItem('token', res.data.token);
    setAuthUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
