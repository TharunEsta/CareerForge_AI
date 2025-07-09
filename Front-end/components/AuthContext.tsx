'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionType {
  plan: 'free' | 'premium' | 'enterprise';
  status?: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  subscription?: SubscriptionType;
}

interface AuthContextType {
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

<<<<<<< Updated upstream
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const res = await fetch('/api/auth/validate', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            setUser(null);
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('auth_token');
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      setUser(null);
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      setUser(null);
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile
  };
=======
  const login = (userData: UserType) => setUser(userData);
  const logout = () => setUser(null);
>>>>>>> Stashed changes

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

