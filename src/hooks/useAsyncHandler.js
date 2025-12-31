/**
 * Hook para manejo de operaciones asíncronas
 * Centraliza el patrón try-catch-finally duplicado en el proyecto
 */
import { useState, useCallback } from 'react';
import { toast } from '@shared/components/ui/use-toast';
import { getErrorMessage } from './useNotification';

/**
 * Hook que maneja estados de loading, error y ejecución de funciones asíncronas
 * @param {Object} options - Opciones de configuración
 * @param {string} options.errorTitle - Título para toast de error
 * @param {string} options.successTitle - Título para toast de éxito
 * @param {string} options.successMessage - Mensaje para toast de éxito
 * @param {boolean} options.showSuccessToast - Mostrar toast en éxito (default: false)
 * @param {boolean} options.showErrorToast - Mostrar toast en error (default: true)
 * @param {Function} options.onSuccess - Callback ejecutado en éxito
 * @param {Function} options.onError - Callback ejecutado en error
 * @returns {Object} { execute, loading, error, reset }
 */
export const useAsyncHandler = (options = {}) => {
  const {
    errorTitle = 'Error',
    successTitle = '¡Éxito!',
    successMessage = 'Operación completada',
    showSuccessToast = false,
    showErrorToast = true,
    onSuccess,
    onError,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  const execute = useCallback(
    async (asyncFn, customErrorMessage) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn();

        if (showSuccessToast) {
          toast({
            title: successTitle,
            description: successMessage,
            variant: 'default',
          });
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return { success: true, data: result };
      } catch (err) {
        const errorMsg = getErrorMessage(err, customErrorMessage || 'Ha ocurrido un error');

        console.error(`${errorTitle}:`, err);
        setError(errorMsg);

        if (showErrorToast) {
          toast({
            title: errorTitle,
            description: errorMsg,
            variant: 'destructive',
          });
        }

        if (onError) {
          onError(err);
        }

        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [errorTitle, successTitle, successMessage, showSuccessToast, showErrorToast, onSuccess, onError]
  );

  return {
    execute,
    loading,
    error,
    reset,
    setError,
  };
};

/**
 * Hook simplificado para operaciones de formulario
 * @param {Function} submitFn - Función de envío
 * @param {Object} options - Opciones adicionales
 * @returns {Object} { handleSubmit, loading, error, success }
 */
export const useFormSubmit = (submitFn, options = {}) => {
  const [success, setSuccess] = useState(false);

  const handler = useAsyncHandler({
    ...options,
    onSuccess: (result) => {
      setSuccess(true);
      if (options.onSuccess) options.onSuccess(result);
    },
  });

  const handleSubmit = useCallback(
    async (e, data) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      setSuccess(false);
      return handler.execute(() => submitFn(data));
    },
    [submitFn, handler]
  );

  const reset = useCallback(() => {
    handler.reset();
    setSuccess(false);
  }, [handler]);

  return {
    handleSubmit,
    loading: handler.loading,
    error: handler.error,
    success,
    reset,
  };
};

export default useAsyncHandler;
