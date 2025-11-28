import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

/**
 * Servicio para gestión de usuarios (Admin)
 */
export const userService = {
  /**
   * Obtener todos los usuarios
   * @param {Object} filters - Filtros opcionales (role, status, search)
   * @returns {Promise} Lista de usuarios
   */
  async getAllUsers(filters = {}) {
    const params = new URLSearchParams();

    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.USERS}?${queryString}` : API_ENDPOINTS.USERS;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Obtener usuario por ID
   * @param {number} userId - ID del usuario
   * @returns {Promise} Datos del usuario
   */
  async getUserById(userId) {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },

  /**
   * Crear nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Usuario creado
   */
  async createUser(userData) {
    const response = await api.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  },

  /**
   * Actualizar usuario
   * @param {number} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise} Usuario actualizado
   */
  async updateUser(userId, userData) {
    const response = await api.put(API_ENDPOINTS.USER_BY_ID(userId), userData);
    return response.data;
  },

  /**
   * Cambiar rol de usuario
   * @param {number} userId - ID del usuario
   * @param {string} newRole - Nuevo rol (user, company, vivero, plantador, admin)
   * @returns {Promise} Usuario actualizado
   */
  async updateUserRole(userId, newRole) {
    const response = await api.put(`${API_ENDPOINTS.USER_BY_ID(userId)}/role`, {
      role: newRole
    });
    return response.data;
  },

  /**
   * Activar/Desactivar usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise} Usuario actualizado
   */
  async toggleUserActive(userId) {
    const response = await api.put(`${API_ENDPOINTS.USER_BY_ID(userId)}/toggle-active`);
    return response.data;
  },

  /**
   * Eliminar usuario (soft delete)
   * @param {number} userId - ID del usuario
   * @returns {Promise} Confirmación
   */
  async deleteUser(userId) {
    const response = await api.delete(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },

  /**
   * Restaurar usuario eliminado
   * @param {number} userId - ID del usuario
   * @returns {Promise} Usuario restaurado
   */
  async restoreUser(userId) {
    const response = await api.post(`${API_ENDPOINTS.USER_BY_ID(userId)}/restore`);
    return response.data;
  }
};

export default userService;
