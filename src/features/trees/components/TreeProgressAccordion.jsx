import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, TreePine, Calendar, MapPin, MessageCircle, Star, Eye } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import TreeProgressTimeline from './TreeProgressTimeline';
import TreeTrackingMap from './TreeTrackingMap';
import TreeChat from './TreeChat';
import PlanterRating from './PlanterRating';

// Componente individual de tarjeta con lazy loading
const TreeProgressItem = React.memo(({ tree, workOrder, statusInfo, userId, navigate, user, isExpanded, onToggle, messagesData, historyData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header del árbol - Siempre visible y clickeable */}
      <div
        className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TreePine className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{tree.name}</h3>
              <p className="text-sm text-gray-600">{tree.country}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
              <span className="mr-1">{statusInfo.emoji}</span>
              {statusInfo.label}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Contenido del progreso - Solo se renderiza cuando está expandido (lazy loading) */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Barra de progreso grande */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso de Plantación
              </span>
              <span className="text-sm font-semibold text-green-600">
                {statusInfo.progress} de 7 pasos ({Math.round((statusInfo.progress / 7) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(statusInfo.progress / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Timeline de progreso */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Historial de Progreso
            </h4>
            <TreeProgressTimeline
              workOrderId={workOrder.id}
              initialHistory={historyData?.[workOrder.id] || null}
              initialStatus={workOrder.status}
            />
          </div>

          {/* Grid de información y acciones */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mapa */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Ubicación
              </h4>
              <TreeTrackingMap tree={tree} workOrder={workOrder} />
            </div>

            {/* Chat */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat con Plantador/Vivero
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <TreeChat
                workOrderId={workOrder.id}
                currentUserId={user?.id}
                initialMessages={messagesData?.[workOrder.id] || null}
              />
              </div>
            </div>
          </div>

          {/* Calificación del plantador (solo si está plantado) */}
          {workOrder.status === 'plantada' && workOrder.planter_id && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-600" />
                Califica al Plantador
              </h4>
              <PlanterRating
                workOrderId={workOrder.id}
                planterId={workOrder.planter_id}
                isOwner={true}
              />
            </div>
          )}

          {/* Información adicional */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">ID de Orden</p>
              <p className="text-sm font-semibold text-gray-900">#{workOrder.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Creada</p>
              <p className="text-sm font-semibold text-gray-900">
                {workOrder.created_at
                  ? new Date(workOrder.created_at).toLocaleDateString('es-ES')
                  : 'N/A'}
              </p>
            </div>
            {workOrder.completed_at && (
              <div>
                <p className="text-xs text-gray-500">Completada</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(workOrder.completed_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
            <div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/usuario/${userId}/arboles/${tree.id}`);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalles
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

TreeProgressItem.displayName = 'TreeProgressItem';

// Componente principal del acordeón
const TreeProgressAccordion = ({ trees, workOrders, getStatusConfig, userId, navigate, user, messagesData = {}, historyData = {} }) => {
  // Estado para trackear qué árboles están expandidos (solo el primero por defecto)
  const [expandedTrees, setExpandedTrees] = useState(() => {
    const firstTreeId = trees[0]?.id;
    return firstTreeId ? new Set([firstTreeId]) : new Set();
  });

  // Función para toggle de expansión
  const toggleTreeExpansion = useCallback((treeId) => {
    setExpandedTrees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(treeId)) {
        newSet.delete(treeId);
      } else {
        newSet.add(treeId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="space-y-6">
      {trees.map(tree => {
        const workOrder = workOrders[tree.id];
        const statusInfo = getStatusConfig(workOrder.status);

        return (
          <TreeProgressItem
            key={tree.id}
            tree={tree}
            workOrder={workOrder}
            statusInfo={statusInfo}
            userId={userId}
            navigate={navigate}
            user={user}
            isExpanded={expandedTrees.has(tree.id)}
            onToggle={() => toggleTreeExpansion(tree.id)}
            messagesData={messagesData}
            historyData={historyData}
          />
        );
      })}
    </div>
  );
};

export default React.memo(TreeProgressAccordion);
