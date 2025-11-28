/**
 * Hook para notificaciones simplificadas
 * Centraliza los patrones de toast duplicados en el proyecto
 */
import { toast } from '@shared/components/ui/use-toast';

/**
 * Hook que proporciona métodos simplificados para mostrar notificaciones
 * @returns {Object} Métodos de notificación: success, error, warning, info
 */
export const useNotification = () => {
  const success = (title, description = '') => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  const error = (title, description = '') => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  const warning = (title, description = '') => {
    toast({
      title,
      description,
      variant: 'warning',
    });
  };

  const info = (title, description = '') => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  return {
    success,
    error,
    warning,
    info,
    toast, // Acceso al toast original para casos especiales
  };
};

/**
 * Función auxiliar para extraer mensaje de error de diferentes fuentes
 * @param {Error|Object|string} error - Error a procesar
 * @param {string} fallbackMessage - Mensaje por defecto
 * @returns {string} Mensaje de error extraído
 */
export const getErrorMessage = (error, fallbackMessage = 'Ha ocurrido un error') => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return fallbackMessage;
};

export default useNotification;
