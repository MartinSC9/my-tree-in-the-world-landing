import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

// Stats service para landing page (público)
export const statsService = {
  async getLandingStats() {
    const response = await api.get(API_ENDPOINTS.STATS_LANDING);
    return response.data;
  },

  async getTopCompanies(limit = 5) {
    const response = await api.get(`${API_ENDPOINTS.STATS_TOP_COMPANIES}?limit=${limit}`);
    return response.data.companies;
  },

  async getTopContributors(limit = 6) {
    const response = await api.get(`${API_ENDPOINTS.STATS_TOP_CONTRIBUTORS}?limit=${limit}`);
    return response.data.contributors;
  }
};

export const treeService = {
  // Get tree markers (optimized for maps - only coordinates)
  async getTreeMarkers() {
    const response = await api.get(API_ENDPOINTS.TREE_MARKERS);
    return response.data.trees;
  },

  // Get all trees
  async getTrees(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${API_ENDPOINTS.TREES}?${params}` : API_ENDPOINTS.TREES;
    const response = await api.get(url);
    return response.data.trees;
  },

  // Get tree by ID
  async getTreeById(id) {
    const response = await api.get(API_ENDPOINTS.TREE_BY_ID(id));
    return response.data.tree;
  },

  // Create tree
  async createTree(treeData) {
    const response = await api.post(API_ENDPOINTS.TREES, treeData);
    return response.data;
  },

  // Update tree
  async updateTree(id, updates) {
    const response = await api.put(API_ENDPOINTS.TREE_BY_ID(id), updates);
    return response.data.tree;
  },

  // Delete tree
  async deleteTree(id) {
    const response = await api.delete(API_ENDPOINTS.TREE_BY_ID(id));
    return response.data;
  }
};

export default treeService;
