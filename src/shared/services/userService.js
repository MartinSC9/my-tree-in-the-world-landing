import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const userService = {
  // Get all users
  async getUsers() {
    const response = await api.get(API_ENDPOINTS.USERS);
    return response.data.users;
  },

  // Get user by ID
  async getUserById(id) {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(id));
    return response.data.user;
  },

  // Update user
  async updateUser(id, updates) {
    const response = await api.put(API_ENDPOINTS.USER_BY_ID(id), updates);
    return response.data.user;
  },

  // Delete user
  async deleteUser(id) {
    const response = await api.delete(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  // Update user role (admin only)
  async updateUserRole(id, role) {
    const response = await api.put(`${API_ENDPOINTS.USER_BY_ID(id)}/role`, { role });
    return response.data;
  },

  // Create user (admin only)
  async createUser(userData) {
    const response = await api.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  }
};

export default userService;
