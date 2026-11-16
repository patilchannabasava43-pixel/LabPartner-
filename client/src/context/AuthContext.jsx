import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('labpartner_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('labpartner_token'));
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Restore authenticated session on page refresh
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authService.getMe();
        if (data.success && data.user) {
          setUser(data.user);
          setProfile(data.profile);
          localStorage.setItem('labpartner_user', JSON.stringify(data.user));
        }
      } catch (err) {
        // Clear stale session
        localStorage.removeItem('labpartner_token');
        localStorage.removeItem('labpartner_user');
        setUser(null);
        setProfile(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        const { token: newToken, user: newUser, profile: newProfile } = data;
        
        if (rememberMe) {
          localStorage.setItem('labpartner_token', newToken);
          localStorage.setItem('labpartner_user', JSON.stringify(newUser));
        } else {
          sessionStorage.setItem('labpartner_token', newToken);
        }

        setToken(newToken);
        setUser(newUser);
        setProfile(newProfile);
        showToast(`Welcome back, ${newUser.fullName || newUser.name}!`, 'success');
        return { success: true, user: newUser };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Registration handler
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success) {
        showToast('Registration complete! Please sign in with your credentials.', 'success');
        return { success: true };
      }
      return { success: false, error: data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('labpartner_token');
      localStorage.removeItem('labpartner_user');
      sessionStorage.removeItem('labpartner_token');
      setToken(null);
      setUser(null);
      setProfile(null);
      showToast('You have been signed out safely.', 'info');
    }
  };

  // Refresh profile & user data
  const refreshMe = async () => {
    try {
      const data = await authService.getMe();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile);
        localStorage.setItem('labpartner_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Session sync error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user,
        toasts,
        showToast,
        removeToast,
        login,
        register,
        logout,
        refreshMe,
        setUser,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
