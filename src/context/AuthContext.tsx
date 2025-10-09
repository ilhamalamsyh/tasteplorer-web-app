'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  email: string;
  fullname: string;
  username: string;
  birthDate: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, userToken: string) => void;
  register: (userData: User, userToken: string) => void;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      // Load user from localStorage
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);

      setUser(userData);
      setToken(userToken);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      throw new Error('Failed to save user data');
    }
  };

  const register = (userData: User, userToken: string) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);

      setUser(userData);
      setToken(userToken);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      throw new Error('Failed to save user data');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);

      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
