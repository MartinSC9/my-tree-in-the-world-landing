/**
 * Servicio de API para Plantadores
 * Sistema de pool público tipo Rappi/Uber
 */

import api from '@/core/config/api';

const BASE_URL = '/planters';

export const planterService = {
  /**
   * Obtener órdenes disponibles en el pool público
   * Sistema de prioridad por rating del plantador
   * @returns {Promise<{workOrders: Array, planter: Object, message: string}>}
   */
  async getAvailableOrders() {
    const response = await api.get(`${BASE_URL}/work-orders/available`);
    return response.data;
  },

  /**
   * Tomar una orden del pool (first-come-first-served)
   * @param {number} orderId - ID de la orden de trabajo
   * @returns {Promise<{message: string, workOrder: Object, warning: string}>}
   */
  async claimOrder(orderId) {
    const response = await api.post(`${BASE_URL}/work-orders/${orderId}/claim`);
    return response.data;
  },

  /**
   * Confirmar retiro del árbol en el vivero
   * @param {number} orderId - ID de la orden de trabajo
   * @returns {Promise<{message: string, next_step: string}>}
   */
  async confirmPickup(orderId) {
    const response = await api.post(`${BASE_URL}/work-orders/${orderId}/confirm-pickup`);
    return response.data;
  },

  /**
   * Iniciar viaje a ubicación de plantación
   * @param {number} orderId - ID de la orden de trabajo
   * @returns {Promise<{message: string}>}
   */
  async startTravel(orderId) {
    const response = await api.post(`${BASE_URL}/work-orders/${orderId}/start-travel`);
    return response.data;
  },

  /**
   * Iniciar proceso de plantación
   * @param {number} orderId - ID de la orden de trabajo
   * @returns {Promise<{message: string}>}
   */
  async startPlanting(orderId) {
    const response = await api.post(`${BASE_URL}/work-orders/${orderId}/start-planting`);
    return response.data;
  },

  /**
   * Completar orden con evidencia fotográfica
   * @param {number} orderId - ID de la orden de trabajo
   * @param {Object} data - Datos de completación
   * @param {string[]} data.photo_urls - Array de URLs de fotos (mínimo 3)
   * @param {number} data.actual_latitude - Latitud GPS donde se plantó
   * @param {number} data.actual_longitude - Longitud GPS donde se plantó
   * @param {string} data.planting_notes - Notas opcionales
   * @returns {Promise<{message: string, earnings: Object}>}
   */
  async completeOrder(orderId, data) {
    const response = await api.post(`${BASE_URL}/work-orders/${orderId}/complete`, data);
    return response.data;
  },

  /**
   * Configurar zona de trabajo (centro + radio 30 km)
   * @param {Object} zoneData - Datos de la zona
   * @param {number} zoneData.center_latitude - Latitud del centro
   * @param {number} zoneData.center_longitude - Longitud del centro
   * @param {number} zoneData.radius_km - Radio en km (default 30)
   * @param {string} zoneData.address - Dirección de referencia
   * @returns {Promise<{message: string}>}
   */
  async configureZone(zoneData) {
    const response = await api.post(`${BASE_URL}/zone`, zoneData);
    return response.data;
  },

  /**
   * Obtener configuración de zona de trabajo
   * @returns {Promise<{zone: Object|null}>}
   */
  async getZone() {
    const response = await api.get(`${BASE_URL}/zone`);
    return response.data;
  },

  /**
   * Obtener estadísticas del plantador
   * @returns {Promise<{stats: Object, earnings: Object}>}
   */
  async getStats() {
    const response = await api.get(`${BASE_URL}/stats`);
    return response.data;
  },

  /**
   * Obtener historial de ganancias
   * @param {Object} filters - Filtros opcionales
   * @param {string} filters.status - Estado del pago (pending, paid, cancelled)
   * @param {number} filters.limit - Límite de resultados
   * @param {number} filters.offset - Offset para paginación
   * @returns {Promise<{earnings: Array}>}
   */
  async getEarnings(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${BASE_URL}/earnings?${params}` : `${BASE_URL}/earnings`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Obtener mis órdenes activas
   * @returns {Promise<Array>}
   */
  async getMyActiveOrders() {
    const response = await api.get('/work-orders', {
      params: {
        planter_id: 'me', // El backend debería interpretar esto
        status: ['entregada_plantador', 'plantador_en_camino', 'plantando'].join(',')
      }
    });
    return response.data.workOrders || [];
  },

  /**
   * Obtener historial de órdenes completadas
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Array>}
   */
  async getCompletedOrders(limit = 20) {
    const response = await api.get('/work-orders', {
      params: {
        planter_id: 'me',
        status: 'plantada',
        limit
      }
    });
    return response.data.workOrders || [];
  }
};

export default planterService;
