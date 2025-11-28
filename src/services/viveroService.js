import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// DASHBOARD & STATISTICS
// =====================================================

/**
 * Get complete dashboard statistics for a nursery
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} Dashboard stats including pending orders, revenue, ratings
 */
export const getViveroStats = async (nurseryId) => {
  try {
    const response = await api.get(`/vivero/stats/${nurseryId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting vivero stats:', error);
    throw error;
  }
};

// =====================================================
// ORDER MANAGEMENT - LIST & FILTER
// =====================================================

/**
 * Get all orders for a nursery with optional filters
 * @param {number} nurseryId - Nursery user ID
 * @param {object} params - Query params: { status?, limit?, offset? }
 * @returns {Promise} List of orders with pagination
 */
export const getViveroOrders = async (nurseryId, params = {}) => {
  try {
    const response = await api.get(`/vivero/orders/${nurseryId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting vivero orders:', error);
    throw error;
  }
};

/**
 * Get orders pending response (within 2-hour window)
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} List of orders needing response
 */
export const getPendingOrders = async (nurseryId) => {
  return getViveroOrders(nurseryId, { status: 'pendiente_respuesta_vivero' });
};

/**
 * Get orders currently in preparation
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} List of orders in preparation
 */
export const getPreparingOrders = async (nurseryId) => {
  return getViveroOrders(nurseryId, {
    status: 'vivero_preparando,aceptada_por_vivero',
  });
};

/**
 * Get trees ready for planter pickup
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} List of ready trees
 */
export const getReadyTrees = async (nurseryId) => {
  return getViveroOrders(nurseryId, {
    status: 'planta_lista,lista_para_plantador',
  });
};

/**
 * Get completed shipments history
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} List of completed orders
 */
export const getShipmentHistory = async (nurseryId) => {
  return getViveroOrders(nurseryId, {
    status: 'entregada_plantador,plantada',
  });
};

// =====================================================
// ORDER ACTIONS - ACCEPT/REJECT
// =====================================================

/**
 * Accept an order and set preparation time
 * @param {number} orderId - Work order ID
 * @param {number} preparationDays - Days needed for preparation (1-5)
 * @returns {Promise} Confirmation with preparation deadline
 */
export const acceptOrder = async (orderId, preparationDays) => {
  try {
    if (!preparationDays || preparationDays < 1 || preparationDays > 5) {
      throw new Error('Preparation days must be between 1 and 5');
    }

    const response = await api.post(`/vivero/orders/${orderId}/accept`, {
      preparation_days: preparationDays,
    });
    return response.data;
  } catch (error) {
    console.error('Error accepting order:', error);
    throw error;
  }
};

/**
 * Reject an order with a reason
 * @param {number} orderId - Work order ID
 * @param {string} rejectionReason - Reason for rejection (min 10 chars)
 * @returns {Promise} Confirmation of rejection
 */
export const rejectOrder = async (orderId, rejectionReason) => {
  try {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      throw new Error('Rejection reason must be at least 10 characters');
    }

    const response = await api.post(`/vivero/orders/${orderId}/reject`, {
      rejection_reason: rejectionReason,
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting order:', error);
    throw error;
  }
};

// =====================================================
// PREPARATION MANAGEMENT
// =====================================================

/**
 * Start preparation for an order
 * @param {number} orderId - Work order ID
 * @returns {Promise} Confirmation that preparation started
 */
export const startPreparation = async (orderId) => {
  try {
    const response = await api.put(
      `/vivero/orders/${orderId}/start-preparation`
    );
    return response.data;
  } catch (error) {
    console.error('Error starting preparation:', error);
    throw error;
  }
};

/**
 * Mark tree as ready for planter pickup
 * @param {number} orderId - Work order ID
 * @param {object} data - { preparation_notes?: string, preparation_photos?: string[] }
 * @returns {Promise} Confirmation that tree is ready
 */
export const markTreeReady = async (orderId, data = {}) => {
  try {
    const response = await api.put(`/vivero/orders/${orderId}/mark-ready`, data);
    return response.data;
  } catch (error) {
    console.error('Error marking tree as ready:', error);
    throw error;
  }
};

// =====================================================
// DELIVERY TO PLANTER
// =====================================================

/**
 * Confirm delivery to planter
 * @param {number} orderId - Work order ID
 * @param {object} data - { verification_code?: string, planter_id: number, delivery_photo_url?: string }
 * @returns {Promise} Confirmation of delivery
 */
export const deliverToPlanter = async (orderId, data) => {
  try {
    if (!data.planter_id) {
      throw new Error('Planter ID is required');
    }

    const response = await api.put(
      `/vivero/orders/${orderId}/deliver-to-planter`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error delivering to planter:', error);
    throw error;
  }
};

// =====================================================
// RATINGS & PENALTIES
// =====================================================

/**
 * Get all ratings for a nursery
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} List of ratings with summary
 */
export const getViveroRatings = async (nurseryId) => {
  try {
    const response = await api.get(`/vivero/${nurseryId}/ratings`);
    return response.data;
  } catch (error) {
    console.error('Error getting vivero ratings:', error);
    throw error;
  }
};

/**
 * Get all penalties for a nursery
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} List of penalties
 */
export const getViveroPenalties = async (nurseryId) => {
  try {
    const response = await api.get(`/vivero/${nurseryId}/penalties`);
    return response.data;
  } catch (error) {
    console.error('Error getting vivero penalties:', error);
    throw error;
  }
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Calculate time remaining until deadline
 * @param {string} deadline - ISO timestamp of deadline
 * @returns {object} { hours, minutes, seconds, expired }
 */
export const getTimeUntilDeadline = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
};

/**
 * Format time remaining as string
 * @param {object} timeObj - Object from getTimeUntilDeadline
 * @returns {string} Formatted time string (e.g., "1h 23m")
 */
export const formatTimeRemaining = (timeObj) => {
  if (timeObj.expired) {
    return 'Expirado';
  }

  if (timeObj.hours > 0) {
    return `${timeObj.hours}h ${timeObj.minutes}m`;
  }

  if (timeObj.minutes > 0) {
    return `${timeObj.minutes}m ${timeObj.seconds}s`;
  }

  return `${timeObj.seconds}s`;
};

/**
 * Get urgency level based on time remaining
 * @param {number} secondsRemaining - Seconds until deadline
 * @returns {string} 'critical' | 'warning' | 'normal'
 */
export const getUrgencyLevel = (secondsRemaining) => {
  if (secondsRemaining <= 0) return 'expired';
  if (secondsRemaining < 30 * 60) return 'critical'; // Less than 30 minutes
  if (secondsRemaining < 60 * 60) return 'warning'; // Less than 1 hour
  return 'normal';
};

// =====================================================
// PUBLIC API - USER TREE PLANTING FLOW
// =====================================================

/**
 * Search for nurseries near a location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} locationType - 'public' | 'own_property' | 'third_party_property'
 * @param {number} radius - Search radius in km (default: 50)
 * @returns {Promise} List of nearby nurseries with distance, rating, and available species count
 */
export const searchNearbyNurseries = async (latitude, longitude, locationType = 'public', radius = 50) => {
  try {
    const response = await api.get('/vivero/search/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
        location_type: locationType,
        radius: radius
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching nearby nurseries:', error);
    throw error;
  }
};

/**
 * Get nursery catalog filtered by location type
 * @param {number} nurseryId - Nursery user ID
 * @param {string} locationType - 'public' | 'own_property' | 'third_party_property'
 * @returns {Promise} Tree catalog with species, prices, stock, and preparation time
 */
export const getNurseryCatalog = async (nurseryId, locationType = 'public') => {
  try {
    const response = await api.get(`/vivero/${nurseryId}/catalog`, {
      params: {
        location_type: locationType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting nursery catalog:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific tree species
 * @param {number} speciesId - Tree species ID
 * @returns {Promise} Detailed species information including care instructions, climate requirements
 */
export const getTreeSpeciesDetails = async (speciesId) => {
  try {
    const response = await api.get(`/vivero/species/${speciesId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting tree species details:', error);
    throw error;
  }
};

/**
 * Get nursery profile information (for user view)
 * @param {number} nurseryId - Nursery user ID
 * @returns {Promise} Nursery profile with name, description, specialties, ratings
 */
export const getNurseryProfile = async (nurseryId) => {
  try {
    const response = await api.get(`/vivero/${nurseryId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error getting nursery profile:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  getViveroStats,
  getViveroOrders,
  getPendingOrders,
  getPreparingOrders,
  getReadyTrees,
  getShipmentHistory,
  acceptOrder,
  rejectOrder,
  startPreparation,
  markTreeReady,
  deliverToPlanter,
  getViveroRatings,
  getViveroPenalties,
  getTimeUntilDeadline,
  formatTimeRemaining,
  getUrgencyLevel,
  // Public API
  searchNearbyNurseries,
  getNurseryCatalog,
  getTreeSpeciesDetails,
  getNurseryProfile,
};
