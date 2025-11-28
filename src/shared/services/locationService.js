import api from '@core/config/api';

/**
 * Servicio para gestión de ubicaciones y permisos
 */

// =====================================================
// CACHÉ GLOBAL PARA HOME ADDRESS
// =====================================================
let homeAddressCache = null;
let homeAddressCachePromise = null;

/**
 * Limpiar caché de home address (útil al actualizar el domicilio)
 */
export const clearHomeAddressCache = () => {
  homeAddressCache = null;
  homeAddressCachePromise = null;
};

// =====================================================
// APIS DE DOMICILIO DEL USUARIO
// =====================================================

/**
 * Registrar y geocodificar domicilio del usuario
 * @param {Object} data - { address, latitude, longitude }
 */
export const saveHomeAddress = async (data) => {
  try {
    const response = await api.post('/users/me/home-address', data);
    // Limpiar caché al guardar nuevo domicilio
    clearHomeAddressCache();
    return response.data;
  } catch (error) {
    console.error('Error al guardar domicilio:', error);
    throw error;
  }
};

/**
 * Obtener domicilio registrado del usuario (CON CACHÉ GLOBAL)
 */
export const getHomeAddress = async () => {
  // Si ya tenemos datos en caché, devolverlos inmediatamente
  if (homeAddressCache !== null) {
    return homeAddressCache;
  }

  // Si ya hay una petición en curso, esperar a que termine
  if (homeAddressCachePromise !== null) {
    return homeAddressCachePromise;
  }

  // Hacer la petición y guardarla en el promise cache
  homeAddressCachePromise = api.get('/users/me/home-address')
    .then(response => {
      homeAddressCache = response.data;
      homeAddressCachePromise = null;
      return response.data;
    })
    .catch(error => {
      console.error('Error al obtener domicilio:', error);
      homeAddressCachePromise = null;
      throw error;
    });

  return homeAddressCachePromise;
};

/**
 * Eliminar domicilio registrado
 */
export const deleteHomeAddress = async () => {
  try {
    const response = await api.delete('/users/me/home-address');
    // Limpiar caché al eliminar domicilio
    clearHomeAddressCache();
    return response.data;
  } catch (error) {
    console.error('Error al eliminar domicilio:', error);
    throw error;
  }
};

// =====================================================
// APIS DE DETECCIÓN DE TIPO DE UBICACIÓN
// =====================================================

/**
 * Detectar tipo de ubicación basándose en domicilio registrado
 * @param {number} latitude - Latitud de la ubicación
 * @param {number} longitude - Longitud de la ubicación
 */
export const detectLocationType = async (latitude, longitude) => {
  try {
    const response = await api.post('/location/detect-type', {
      latitude,
      longitude
    });
    return response.data;
  } catch (error) {
    console.error('Error al detectar tipo de ubicación:', error);
    throw error;
  }
};

/**
 * Validar si una ubicación está dentro del radio del domicilio (50m)
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 */
export const validateHomeRadius = async (latitude, longitude) => {
  try {
    const response = await api.get('/location/validate-home-radius', {
      params: { latitude, longitude }
    });
    return response.data;
  } catch (error) {
    console.error('Error al validar radio:', error);
    throw error;
  }
};

// =====================================================
// APIS DE PERMISOS DE UBICACIÓN
// =====================================================

/**
 * Solicitar permiso para plantar en propiedad ajena
 * @param {Object} data - {
 *   property_owner_email,
 *   property_owner_phone,
 *   latitude,
 *   longitude,
 *   address
 * }
 */
export const requestLocationPermission = async (data) => {
  try {
    const response = await api.post('/location-permissions/request', data);
    return response.data;
  } catch (error) {
    console.error('Error al solicitar permiso:', error);
    throw error;
  }
};

/**
 * Validar código de permiso de 6 dígitos
 * @param {string} permissionCode - Código de 6 dígitos
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 */
export const validatePermissionCode = async (permissionCode, latitude, longitude) => {
  try {
    const response = await api.post('/location-permissions/validate', {
      permission_code: permissionCode,
      latitude,
      longitude
    });
    return response.data;
  } catch (error) {
    console.error('Error al validar código:', error);
    throw error;
  }
};

/**
 * Obtener estado de un permiso por código
 * @param {string} code - Código del permiso
 */
export const getPermissionByCode = async (code) => {
  try {
    const response = await api.get(`/location-permissions/${code}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener permiso:', error);
    throw error;
  }
};

/**
 * Obtener todas mis solicitudes de permiso
 * @param {string} status - Filtrar por estado (opcional)
 */
export const getMyPermissionRequests = async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/location-permissions/my-requests', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }
};

/**
 * Cancelar una solicitud de permiso
 * @param {number} id - ID del permiso
 */
export const cancelPermissionRequest = async (id) => {
  try {
    const response = await api.delete(`/location-permissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al cancelar permiso:', error);
    throw error;
  }
};

const locationService = {
  // Domicilio
  saveHomeAddress,
  getHomeAddress,
  deleteHomeAddress,
  clearHomeAddressCache,

  // Detección
  detectLocationType,
  validateHomeRadius,

  // Permisos
  requestLocationPermission,
  validatePermissionCode,
  getPermissionByCode,
  getMyPermissionRequests,
  cancelPermissionRequest
};

export default locationService;
