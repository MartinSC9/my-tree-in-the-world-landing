import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para moderación de contenido (Admin)
 */
export const moderationService = {
  /**
   * Obtener todos los posts
   * @param {Object} filters - Filtros opcionales
   * @param {boolean} filters.flagged - Solo posts reportados
   * @param {boolean} filters.hidden - Solo posts ocultos
   * @returns {Promise} Lista de posts
   */
  async getAllPosts(filters = {}) {
    const params = new URLSearchParams();

    if (filters.flagged !== undefined) params.append('flagged', filters.flagged);
    if (filters.hidden !== undefined) params.append('hidden', filters.hidden);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.MODERATION_POSTS}?${queryString}`
      : API_ENDPOINTS.MODERATION_POSTS;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Marcar post como reportado (cualquier usuario)
   * @param {number} postId - ID del post
   * @returns {Promise} Post actualizado
   */
  async flagPost(postId) {
    const response = await api.put(`${API_ENDPOINTS.MODERATION_POSTS}/${postId}/flag`);
    return response.data;
  },

  /**
   * Ocultar post (admin only)
   * @param {number} postId - ID del post
   * @returns {Promise} Post actualizado
   */
  async hidePost(postId) {
    const response = await api.put(`${API_ENDPOINTS.MODERATION_POSTS}/${postId}/hide`);
    return response.data;
  },

  /**
   * Desmarcar post como reportado (admin only)
   * @param {number} postId - ID del post
   * @returns {Promise} Post actualizado
   */
  async unflagPost(postId) {
    const response = await api.put(`${API_ENDPOINTS.MODERATION_POSTS}/${postId}/unflag`);
    return response.data;
  },

  /**
   * Obtener solo posts reportados (shorthand)
   * @returns {Promise} Posts reportados
   */
  async getFlaggedPosts() {
    return this.getAllPosts({ flagged: true, hidden: false });
  },

  /**
   * Obtener solo posts ocultos (shorthand)
   * @returns {Promise} Posts ocultos
   */
  async getHiddenPosts() {
    return this.getAllPosts({ hidden: true });
  }
};

export default moderationService;
