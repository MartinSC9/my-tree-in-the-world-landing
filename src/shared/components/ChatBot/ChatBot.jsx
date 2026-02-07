import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, TreePine } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { chatService } from '@/services/chatService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        '¡Hola! Soy el asistente de Mi Árbol en el Mundo. Puedo ayudarte con información sobre cómo plantar árboles, el proceso de plantación, precios, y cualquier duda que tengas sobre nuestra plataforma. ¿En qué puedo ayudarte?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Preparar historial para la API (excluir el mensaje inicial del bot)
      const chatHistory = messages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await chatService.sendMessage(userMessage.content, chatHistory);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo o contáctanos directamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <MessageCircle className="h-6 w-6" />
        {/* Indicador de notificación */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        </span>
      </motion.button>

      {/* Panel de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[380px] h-full sm:h-[520px] bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <TreePine className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Asistente Virtual</h3>
                  <p className="text-xs text-emerald-100">Mi Árbol en el Mundo</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Indicador de typing */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm disabled:opacity-50"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Powered by AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
