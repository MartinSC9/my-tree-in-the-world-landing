import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const userService = {
  // Get user by ID
  async getUserById(id) {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(id));
    return response.data.user;
  }
};

export default userService;
