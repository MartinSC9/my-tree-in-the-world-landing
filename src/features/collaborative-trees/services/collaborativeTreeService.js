import api from '@core/config/api';

/**
 * Crear un nuevo proyecto de árbol colaborativo
 */
export const createCollaborativeTree = async (projectData) => {
  try {
    const response = await api.post('/collaborative-trees', projectData);
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto colaborativo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Verificar si el usuario puede crear un proyecto colaborativo
 * @returns {Promise<{can_create: boolean, reason: string, user_type: string, limitations: Object}>}
 */
export const canCreateCollaborativeTree = async () => {
  try {
    const response = await api.get('/collaborative-trees/can-create');
    return response.data;
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtener lista de proyectos colaborativos activos
 * @param {Object} params - Parámetros de filtrado
 * @param {string} params.status - Estado del proyecto: 'active', 'completed', 'cancelled'
 * @param {string} params.creator_type - Tipo de creador: 'user', 'company', 'all'
 * @param {boolean} params.featured - Solo proyectos destacados
 * @param {number} params.limit - Cantidad de resultados
 * @param {number} params.offset - Offset para paginación
 * @param {string} params.sort - Campo para ordenar
 * @param {string} params.order - Orden: 'ASC' o 'DESC'
 */
export const getCollaborativeTrees = async (params = {}) => {
  try {
    const response = await api.get('/collaborative-trees', {
      params: {
        status: params.status || 'active',
        creator_type: params.creator_type || 'all',
        featured: params.featured,
        limit: params.limit || 20,
        offset: params.offset || 0,
        sort: params.sort || 'created_at',
        order: params.order || 'DESC'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos colaborativos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtener detalles de un proyecto colaborativo específico
 */
export const getCollaborativeTreeById = async (id) => {
  try {
    const response = await api.get(`/collaborative-trees/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyecto colaborativo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Contribuir a un proyecto colaborativo
 */
export const contributeToTree = async (id, contributionData) => {
  try {
    const response = await api.post(`/collaborative-trees/${id}/contribute`, contributionData);
    return response.data;
  } catch (error) {
    console.error('Error al contribuir:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtener lista de contribuyentes de un proyecto
 */
export const getContributors = async (id) => {
  try {
    const response = await api.get(`/collaborative-trees/${id}/contributors`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener contribuyentes:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtener proyectos creados por el usuario autenticado
 */
export const getMyProjects = async () => {
  try {
    const response = await api.get('/collaborative-trees/my-projects');
    return response.data;
  } catch (error) {
    console.error('Error al obtener mis proyectos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtener contribuciones del usuario autenticado
 */
export const getMyContributions = async () => {
  try {
    const response = await api.get('/collaborative-trees/my-contributions');
    return response.data;
  } catch (error) {
    console.error('Error al obtener mis contribuciones:', error);
    throw error.response?.data || error;
  }
};

/**
 * Cancelar un proyecto colaborativo (solo creador o admin)
 */
export const cancelProject = async (id) => {
  try {
    const response = await api.put(`/collaborative-trees/${id}/cancel`, {});
    return response.data;
  } catch (error) {
    console.error('Error al cancelar proyecto:', error);
    throw error.response?.data || error;
  }
};

/**
 * Calcular porcentaje de financiamiento
 */
export const calculateFundingPercentage = (currentAmount, targetAmount) => {
  const current = parseFloat(currentAmount) || 0;
  const target = parseFloat(targetAmount) || 0;
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

/**
 * Formatear monto en ARS
 */
export const formatCurrency = (amount) => {
  const value = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Calcular monto restante
 */
export const calculateRemainingAmount = (currentAmount, targetAmount) => {
  const current = parseFloat(currentAmount) || 0;
  const target = parseFloat(targetAmount) || 0;
  return Math.max(target - current, 0);
};

export default {
  canCreateCollaborativeTree,
  createCollaborativeTree,
  getCollaborativeTrees,
  getCollaborativeTreeById,
  contributeToTree,
  getContributors,
  getMyProjects,
  getMyContributions,
  cancelProject,
  calculateFundingPercentage,
  formatCurrency,
  calculateRemainingAmount
};
