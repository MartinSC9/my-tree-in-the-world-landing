import axios from 'axios';
import { API_BASE_URL } from '@core/config/api.config';
import { toast } from '@shared/components/ui/use-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos para operaciones que pueden tardar más
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró y tenemos refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Mostrar notificación de sesión expirada
        toast({
          title: 'Sesión expirada',
          description: 'Tu sesión ha caducado. Por favor, inicia sesión nuevamente.',
          variant: 'destructive',
          duration: 5000,
        });

        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
