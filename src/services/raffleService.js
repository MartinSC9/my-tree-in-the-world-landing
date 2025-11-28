import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para gestionar sorteos de cupones en proyectos colaborativos
 */
export const raffleService = {
  /**
   * Ejecutar sorteo de cupones (solo empresas/admin)
   * @param {number} projectId - ID del proyecto colaborativo
   * @returns {Promise} Resultado del sorteo
   */
  async executeRaffle(projectId) {
    const response = await api.post(API_ENDPOINTS.RAFFLE_EXECUTE(projectId));
    return response.data;
  },

  /**
   * Obtener resultados del sorteo
   * @param {number} projectId - ID del proyecto colaborativo
   * @returns {Promise} Resultados del sorteo
   */
  async getRaffleResults(projectId) {
    const response = await api.get(API_ENDPOINTS.RAFFLE_RESULTS(projectId));
    return response.data;
  },

  /**
   * Obtener cupones ganados por el usuario actual
   * @returns {Promise} Lista de cupones
   */
  async getMyCoupons() {
    const response = await api.get(API_ENDPOINTS.RAFFLE_MY_COUPONS);
    return response.data;
  },

  /**
   * Validar un cupón
   * @param {string} couponCode - Código del cupón
   * @returns {Promise} Validación del cupón
   */
  async validateCoupon(couponCode) {
    const response = await api.post(API_ENDPOINTS.RAFFLE_VALIDATE_COUPON(couponCode));
    return response.data;
  },

  /**
   * Canjear un cupón
   * @param {string} couponCode - Código del cupón
   * @param {number} purchaseAmount - Monto de la compra
   * @param {string} purchaseDetails - Detalles de la compra
   * @returns {Promise} Resultado del canje
   */
  async redeemCoupon(couponCode, purchaseAmount, purchaseDetails = '') {
    const response = await api.post(API_ENDPOINTS.RAFFLE_REDEEM_COUPON(couponCode), {
      purchase_amount: purchaseAmount,
      purchase_details: purchaseDetails
    });
    return response.data;
  }
};

export default raffleService;
