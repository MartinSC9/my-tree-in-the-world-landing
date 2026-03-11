import api from '@core/config/api';

/**
 * Servicio para el chatbot con IA
 * Se comunica con el backend que usa OpenAI
 */
export const chatService = {
  async sendMessage(message, history = []) {
    try {
      const { data } = await api.post('/chat', { message, history });
      return data;
    } catch (error) {
      console.error('ChatService error:', error);
      throw error;
    }
  },
};

export default chatService;
