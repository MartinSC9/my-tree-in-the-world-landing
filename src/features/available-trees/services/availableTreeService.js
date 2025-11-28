import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const availableTreeService = {
  /**
   * Get all available trees with optional filters
   * @param {Object} filters - { species, nursery_id, min_price, max_price, in_stock }
   * @returns {Promise<Array>} Array of available trees
   */
  async getAvailableTrees(filters = {}) {
    const params = new URLSearchParams();

    if (filters.species) params.append('species', filters.species);
    if (filters.nursery_id) params.append('nursery_id', filters.nursery_id);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.in_stock) params.append('in_stock', 'true');

    const url = params.toString()
      ? `${API_ENDPOINTS.AVAILABLE_TREES}?${params.toString()}`
      : API_ENDPOINTS.AVAILABLE_TREES;

    const response = await api.get(url);
    return response.data.availableTrees || [];
  },

  /**
   * Get available tree by ID
   * @param {number} id - Tree ID
   * @returns {Promise<Object>} Available tree details
   */
  async getAvailableTreeById(id) {
    const response = await api.get(API_ENDPOINTS.AVAILABLE_TREE_BY_ID(id));
    return response.data.availableTree;
  },

  /**
   * Get available trees by nursery
   * @param {number} nurseryId - Nursery user ID
   * @returns {Promise<Array>} Array of available trees from this nursery
   */
  async getAvailableTreesByNursery(nurseryId) {
    const response = await api.get(API_ENDPOINTS.AVAILABLE_TREES_BY_NURSERY(nurseryId));
    return response.data.availableTrees || [];
  },

  /**
   * Create a new available tree (vivero only)
   * @param {Object} treeData - Tree data
   * @returns {Promise<Object>} Created tree
   */
  async createAvailableTree(treeData) {
    const response = await api.post(API_ENDPOINTS.AVAILABLE_TREES, treeData);
    return response.data.availableTree;
  },

  /**
   * Update an available tree (vivero only)
   * @param {number} id - Tree ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated tree
   */
  async updateAvailableTree(id, updates) {
    const response = await api.put(API_ENDPOINTS.AVAILABLE_TREE_BY_ID(id), updates);
    return response.data.availableTree;
  },

  /**
   * Delete an available tree (vivero only)
   * Performs soft delete by setting is_active = 0
   * @param {number} id - Tree ID
   * @returns {Promise<Object>} Success message
   */
  async deleteAvailableTree(id) {
    const response = await api.delete(API_ENDPOINTS.AVAILABLE_TREE_BY_ID(id));
    return response.data;
  },

  /**
   * Get unique species list from available trees
   * @returns {Promise<Array>} Array of unique species names
   */
  async getSpeciesList() {
    const trees = await this.getAvailableTrees();
    const speciesSet = new Set(trees.map(tree => tree.species).filter(Boolean));
    return Array.from(speciesSet).sort();
  },

  /**
   * Purchase a tree from the catalog
   * This creates a tree with available_tree_id reference
   * @param {Object} purchaseData - { available_tree_id, name, latitude, longitude, message }
   * @returns {Promise<Object>} Created tree
   */
  async purchaseTree(purchaseData) {
    const response = await api.post(API_ENDPOINTS.TREES, {
      ...purchaseData,
      country: purchaseData.country || 'Argentina', // Default if not provided
    });
    return response.data;
  }
};

export default availableTreeService;
