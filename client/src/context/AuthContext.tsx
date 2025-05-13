import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  picture?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to login';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (accessToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${API_URL}/auth/google`, { accessToken });
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to login with Google';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to register';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.put(`${API_URL}/auth/profile`, userData);
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    error,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};