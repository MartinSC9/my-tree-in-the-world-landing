import api from '@core/config/api';

/**
 * Servicio para manejar operaciones relacionadas con notificaciones
 */

// Obtener todas las notificaciones del usuario
export const getNotifications = async (unreadOnly = false, limit = 50, offset = 0) => {
  try {
    const response = await api.get('/notifications', {
      params: { unread_only: unreadOnly, limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Marcar una notificación como leída
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async () => {
  try {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Eliminar una notificación
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

export default notificationService;
