import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para logs de auditoría (Admin)
 */
export const auditService = {
  /**
   * Obtener todos los logs de auditoría
   * @param {Object} filters - Filtros opcionales
   * @param {number} filters.userId - Filtrar por usuario
   * @param {string} filters.eventType - Filtrar por tipo de evento
   * @param {number} filters.limit - Límite de resultados
   * @param {number} filters.offset - Offset para paginación
   * @returns {Promise} Lista de logs de auditoría
   */
  async getAllLogs(filters = {}) {
    const params = new URLSearchParams();

    if (filters.userId) params.append('userId', filters.userId);
    if (filters.eventType) params.append('eventType', filters.eventType);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.AUDIT_LOGS}?${queryString}` : API_ENDPOINTS.AUDIT_LOGS;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Obtener log de auditoría por ID
   * @param {number} logId - ID del log
   * @returns {Promise} Detalles del log
   */
  async getLogById(logId) {
    const response = await api.get(API_ENDPOINTS.AUDIT_LOG_BY_ID(logId));
    return response.data;
  },

  /**
   * Obtener logs recientes (para dashboard)
   * @param {number} limit - Cantidad de logs a obtener (default: 10)
   * @returns {Promise} Lista de logs recientes
   */
  async getRecentLogs(limit = 10) {
    const response = await api.get(`${API_ENDPOINTS.AUDIT_LOGS}?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtener tipos de eventos disponibles
   * @returns {Array} Lista de tipos de eventos
   */
  getEventTypes() {
    return [
      'user_created',
      'user_updated',
      'user_deleted',
      'user_restored',
      'user_role_changed',
      'user_activated',
      'user_deactivated',
      'work_order_created',
      'work_order_updated',
      'work_order_deleted',
      'work_order_timeout',
      'tree_created',
      'tree_updated',
      'tree_deleted',
      'post_created',
      'post_flagged',
      'post_hidden',
      'login_attempt',
      'password_changed'
    ];
  }
};

export default auditService;
