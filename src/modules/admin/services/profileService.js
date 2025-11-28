import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para aprobación de perfiles (Admin)
 */
export const profileService = {
  /**
   * Obtener usuarios pendientes de aprobación (viveros y plantadores)
   * @returns {Promise} Lista de usuarios pendientes
   */
  async getPendingApprovals() {
    const response = await api.get(API_ENDPOINTS.PROFILE_PENDING_APPROVALS);
    return response.data;
  },

  /**
   * Aprobar perfil de vivero o plantador
   * @param {number} userId - ID del usuario
   * @returns {Promise} Confirmación de aprobación
   */
  async approveProfile(userId) {
    const response = await api.put(API_ENDPOINTS.PROFILE_APPROVE(userId));
    return response.data;
  },

  /**
   * Rechazar perfil de vivero o plantador
   * @param {number} userId - ID del usuario
   * @param {string} reason - Razón del rechazo
   * @returns {Promise} Confirmación de rechazo
   */
  async rejectProfile(userId, reason) {
    const response = await api.put(API_ENDPOINTS.PROFILE_REJECT(userId), {
      reason
    });
    return response.data;
  }
};

export default profileService;
