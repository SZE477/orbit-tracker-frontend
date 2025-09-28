import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiPost, apiGet } from '@/shared/api/apiClient';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: {
    location?: {
      latitude: number;
      longitude: number;
      city: string;
      country: string;
    };
    timezone: string;
    preferred_units: 'metric' | 'imperial';
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profileData: Partial<User['profile']>) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Verify token and get user data
          const userData = await apiGet<User>('/auth/me/');
          setUser(userData);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          console.error('Token validation failed:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiPost<{ access: string; refresh: string; user: User }>('/auth/login/', {
        username,
        password,
      });

      // Store tokens
      localStorage.setItem('auth_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      setUser(response.user);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiPost<{ access: string; refresh: string; user: User }>('/auth/register/', userData);
      
      // Store tokens
      localStorage.setItem('auth_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      setUser(response.user);
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User['profile']>) => {
    try {
      const updatedUser = await apiPost<User>('/auth/profile/', profileData);
      setUser(updatedUser);
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
