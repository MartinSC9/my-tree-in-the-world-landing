import React, { useState, useEffect, useRef } from 'react';
import api from '@core/config/api';
import { Send, MessageCircle, User } from 'lucide-react';

const TreeChat = ({ workOrderId, currentUserId, initialMessages = null }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Si tenemos mensajes precargados, usarlos
    if (initialMessages !== null) {
      setMessages(initialMessages);
      setLoading(false);
      return; // No hacer fetch
    }

    // Fallback: fetch si no hay datos precargados
    const fetchMessages = async (isInitialLoad = false) => {
      try {
        // Solo mostrar loader en la carga inicial, no en el polling
        if (isInitialLoad) {
          setLoading(true);
        }

        const response = await api.get(`/messages/work-order/${workOrderId}`);
        setMessages(response.data.messages || []);

        // Marcar mensajes como leídos
        await api.put(`/messages/work-order/${workOrderId}/read`, {});

        if (isInitialLoad) {
          setLoading(false);
        }
      } catch (err) {
        console.error('💬 [TreeChat] Error al cargar mensajes:', err);
        console.error('💬 [TreeChat] Error details:', err.response?.data);
        if (isInitialLoad) {
          setError('Error al cargar el chat');
          setLoading(false);
        }
      }
    };

    if (workOrderId) {
      // Carga inicial con loader
      fetchMessages(true);

      // TODO: Reactivar polling en producción
      // Polling cada 5 segundos SIN mostrar loader - DESACTIVADO TEMPORALMENTE
      // const interval = setInterval(() => fetchMessages(false), 5000);
      // return () => clearInterval(interval);
    } else {
    }
  }, [workOrderId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setSending(true);

      const response = await api.post(
        `/messages/work-order/${workOrderId}`,
        { message: newMessage.trim() }
      );

      setMessages(prev => [...prev, response.data.data]);
      setNewMessage('');
      setSending(false);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      alert('Error al enviar mensaje');
      setSending(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'plantador':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'vivero':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'company':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      plantador: 'Plantador',
      vivero: 'Vivero',
      company: 'Empresa',
      user: 'Usuario'
    };
    return labels[role] || 'Usuario';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-semibold">Chat con el Equipo</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 modal-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="h-12 w-12 mb-2" />
            <p className="text-sm">No hay mensajes aún</p>
            <p className="text-xs mt-1">Envía el primer mensaje para iniciar la conversación</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                  {/* Sender Info */}
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-700">
                      {msg.sender_first_name} {msg.sender_last_name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(msg.sender_role)}`}>
                      {getRoleLabel(msg.sender_role)}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(msg.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className="h-5 w-5" />
            <span>{sending ? 'Enviando...' : 'Enviar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(TreeChat);
