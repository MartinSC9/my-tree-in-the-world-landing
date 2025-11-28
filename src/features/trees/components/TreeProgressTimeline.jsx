import React, { useState, useEffect } from 'react';
import api from '@core/config/api';
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';

const TreeProgressTimeline = ({ workOrderId, initialHistory = null, initialStatus = null }) => {
  const [history, setHistory] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

      // Definición de estados en orden - Flujo de 7 pasos (modelo e-commerce)
  const statusSteps = [
    {
      code: 'vivero_preparando',
      name: 'Vivero Preparando',
      emoji: '🌱',
      description: '1-5 días'
    },
    {
      code: 'planta_lista',
      name: 'Planta Lista',
      emoji: '📦',
      description: 'Buscando plantador'
    },
    {
      code: 'plantador_asignado',
      name: 'Plantador Asignado',
      emoji: '👷',
      description: 'Coordinando retiro'
    },
    {
      code: 'retirando_vivero',
      name: 'Retirando Árbol',
      emoji: '🚗',
      description: 'Desde el vivero'
    },
    {
      code: 'plantador_en_camino',
      name: 'En Camino',
      emoji: '🚚',
      description: 'GPS activo'
    },
    {
      code: 'plantando',
      name: 'Plantando',
      emoji: '🌳',
      description: 'En proceso'
    },
    {
      code: 'plantada',
      name: 'Plantada',
      emoji: '✅',
      description: 'Ver certificado'
    }
  ];

  useEffect(() => {
    // Si tenemos datos precargados, usarlos
    if (initialHistory !== null && initialStatus !== null) {
      setHistory(initialHistory);
      setCurrentStatus(initialStatus);
      setLoading(false);
      return; // No hacer fetch
    }

    // Fallback: fetch si no hay datos precargados
    const fetchHistory = async () => {
      try {
        setLoading(true);

        // Obtener historial
        const historyRes = await api.get(`/stats/work-order/${workOrderId}/history`);

        // Obtener info actual de work order
        const orderRes = await api.get(`/work-orders/${workOrderId}`);

        setHistory(historyRes.data.history || []);
        setCurrentStatus(orderRes.data.workOrder?.status);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('Error al cargar el progreso');
        setLoading(false);
      }
    };

    if (workOrderId) {
      fetchHistory();
    }
  }, [workOrderId, initialHistory, initialStatus]);

  const getStatusIndex = (statusCode) => {
    return statusSteps.findIndex(s => s.code === statusCode);
  };

  const getCurrentStatusIndex = () => {
    if (!currentStatus) return -1;
    if (currentStatus === 'cancelada') return -2;
    return getStatusIndex(currentStatus);
  };

  const getStepStatus = (stepIndex) => {
    const currentIndex = getCurrentStatusIndex();

    if (currentStatus === 'cancelada') {
      return 'cancelled';
    }

    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getStatusDate = (statusCode) => {
    const historyItem = history.find(h => h.new_status === statusCode);
    if (historyItem) {
      return new Date(historyItem.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return null;
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

  if (currentStatus === 'cancelada') {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="text-xl font-bold text-red-900">Orden Cancelada</h3>
            <p className="text-sm text-red-700">Esta orden de trabajo fue cancelada</p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="text-sm font-medium text-red-800 mb-2">Historial:</p>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div key={idx} className="text-sm text-red-700">
                  <span className="font-medium">{item.new_status}</span>
                  <span className="text-red-500 ml-2">
                    {new Date(item.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Vista Móvil: Vertical */}
      <div className="lg:hidden">
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div
            className="absolute left-[15px] top-0 w-0.5 bg-green-600 transition-all duration-500"
            style={{
              height: `${(getCurrentStatusIndex() / (statusSteps.length - 1)) * 100}%`
            }}
          ></div>

          {/* Pasos */}
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const status = getStepStatus(index);
              const date = getStatusDate(step.code);

              return (
                <div key={step.code} className="relative flex items-start space-x-3">
                  {/* Ícono */}
                  <div className="relative z-10 flex-shrink-0">
                    {status === 'completed' && (
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {status === 'current' && (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {status === 'pending' && (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Circle className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-lg">{step.emoji}</span>
                      <h4 className={`text-sm font-semibold ${
                        status === 'completed' ? 'text-green-700' :
                        status === 'current' ? 'text-blue-700' :
                        'text-gray-400'
                      }`}>
                        {step.name}
                      </h4>
                    </div>
                    {date && (
                      <p className="text-xs text-gray-500">{date}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vista Desktop: Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Línea horizontal */}
          <div className="absolute top-[19px] left-0 right-0 h-0.5 bg-gray-200"></div>
          <div
            className="absolute top-[19px] left-0 h-0.5 bg-green-600 transition-all duration-500"
            style={{
              width: `${(getCurrentStatusIndex() / (statusSteps.length - 1)) * 100}%`
            }}
          ></div>

          {/* Pasos */}
          <div className="flex justify-between items-start">
            {statusSteps.map((step, index) => {
              const status = getStepStatus(index);
              const date = getStatusDate(step.code);

              return (
                <div key={step.code} className="relative flex flex-col items-center" style={{ flex: '1 1 0' }}>
                  {/* Ícono */}
                  <div className="relative z-10 mb-2">
                    {status === 'completed' && (
                      <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {status === 'current' && (
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {status === 'pending' && (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Circle className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="text-center max-w-[120px]">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <span className="text-xl">{step.emoji}</span>
                    </div>
                    <h4 className={`text-xs font-semibold mb-1 ${
                      status === 'completed' ? 'text-green-700' :
                      status === 'current' ? 'text-blue-700' :
                      'text-gray-400'
                    }`}>
                      {step.name}
                    </h4>
                    {date && (
                      <p className="text-xs text-gray-500">{date}</p>
                    )}
                    {status === 'current' && (
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        Actual
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TreeProgressTimeline);
