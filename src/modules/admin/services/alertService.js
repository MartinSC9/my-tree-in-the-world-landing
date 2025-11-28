import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para alertas del sistema (Admin)
 */
export const alertService = {
  /**
   * Obtener órdenes estancadas (>48h sin plantador)
   * @returns {Promise} Lista de órdenes estancadas
   */
  async getStuckOrders() {
    const response = await api.get(API_ENDPOINTS.ALERTS_STUCK_ORDERS);
    return response.data;
  },

  /**
   * Obtener estadísticas de alertas
   * @returns {Promise} Estadísticas de órdenes estancadas
   */
  async getAlertStats() {
    const response = await api.get(API_ENDPOINTS.ALERTS_STATS);
    return response.data;
  },

  /**
   * Marcar alerta como resuelta
   * @param {number} orderId - ID de la orden
   * @param {string} action - Acción tomada
   * @param {string} notes - Notas opcionales
   * @returns {Promise} Confirmación
   */
  async resolveAlert(orderId, action, notes = '') {
    const response = await api.post(API_ENDPOINTS.ALERTS_RESOLVE(orderId), {
      action,
      notes
    });
    return response.data;
  }
};

export default alertService;
