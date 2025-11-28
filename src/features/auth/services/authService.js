import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    const { token, refreshToken, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  // Register
  async register(userData) {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    const { token, refreshToken, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  // Logout
  async logout() {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.ME);
    return response.data.user;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get user from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user roles
  async getUserRoles() {
    const response = await api.get('/auth/roles');
    return response.data.roles;
  },

  // Add role to user
  async addRole(role) {
    const response = await api.post('/auth/roles/add', { role });
    return response.data;
  },

  // Switch active role
  async switchRole(role) {
    const response = await api.post('/auth/roles/switch', { role });
    const { user } = response.data;

    // Update user in localStorage
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  }
};

export default authService;
