import { API_BASE_URL } from '@core/config/api.config';

/**
 * Servicio para el chatbot con IA
 * Se comunica con el backend que usa OpenAI
 */
export const chatService = {
  /**
   * Envía un mensaje al chatbot y obtiene una respuesta
   * @param {string} message - El mensaje del usuario
   * @param {Array} history - Historial de mensajes previos
   * @returns {Promise<{message: string}>} - La respuesta del asistente
   */
  async sendMessage(message, history = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ChatService error:', error);
      throw error;
    }
  },
};

export default chatService;
