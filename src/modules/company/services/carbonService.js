import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const carbonService = {
  // Get carbon config
  async getConfig() {
    const response = await api.get(API_ENDPOINTS.CARBON_CONFIG);
    return response.data.config;
  },

  // Update carbon config (admin only)
  async updateConfig(config_key, config_value) {
    const response = await api.put(API_ENDPOINTS.CARBON_CONFIG, { config_key, config_value });
    return response.data;
  },

  // Calculate carbon footprint
  async calculate(formData) {
    const response = await api.post(API_ENDPOINTS.CARBON_CALCULATE, { formData });
    return response.data;
  }
};

export default carbonService;
