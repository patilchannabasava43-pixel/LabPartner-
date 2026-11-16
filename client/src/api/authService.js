import api from './axios';

export const authService = {
  // Register a new student
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Authenticate user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Fetch current user and profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Log out current session
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default authService;

