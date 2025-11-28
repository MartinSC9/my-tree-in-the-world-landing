import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para estadísticas del sistema (Admin)
 */
export const statsService = {
  /**
   * Obtener estadísticas generales del sistema
   * @returns {Promise} Estadísticas del sistema
   */
  async getSystemStats() {
    const response = await api.get(API_ENDPOINTS.STATS_SYSTEM);
    return response.data;
  },

  /**
   * Obtener estadísticas de un plantador específico
   * @param {number} planterId - ID del plantador
   * @returns {Promise} Estadísticas del plantador
   */
  async getPlanterStats(planterId) {
    const response = await api.get(API_ENDPOINTS.STATS_PLANTER(planterId));
    return response.data;
  },

  /**
   * Obtener ranking de plantadores
   * @returns {Promise} Lista de plantadores ordenados por performance
   */
  async getPlantersRanking() {
    const response = await api.get(API_ENDPOINTS.STATS_PLANTERS_RANKING);
    return response.data;
  },

  /**
   * Obtener historial completo de una orden de trabajo
   * @param {number} workOrderId - ID de la orden
   * @returns {Promise} Historial de transiciones de estado
   */
  async getWorkOrderHistory(workOrderId) {
    const response = await api.get(API_ENDPOINTS.STATS_WORK_ORDER_HISTORY(workOrderId));
    return response.data;
  },

  /**
   * Obtener resumen de órdenes de trabajo
   * @returns {Promise} Resumen agregado de órdenes
   */
  async getWorkOrdersSummary() {
    const response = await api.get(API_ENDPOINTS.STATS_WORK_ORDERS_SUMMARY);
    return response.data;
  },

  /**
   * Obtener información completa de árboles físicos
   * @returns {Promise} Datos completos de árboles con joins
   */
  async getPhysicalTreesFull() {
    const response = await api.get(API_ENDPOINTS.STATS_PHYSICAL_TREES_FULL);
    return response.data;
  },

  /**
   * Obtener historial completo de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise} Historial de árboles, certificados, órdenes
   */
  async getUserHistory(userId) {
    const response = await api.get(API_ENDPOINTS.STATS_USER_HISTORY(userId));
    return response.data;
  }
};

export default statsService;
