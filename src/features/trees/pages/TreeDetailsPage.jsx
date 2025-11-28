import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@core/config/api';
import { ArrowLeft, TreePine, MapPin, Calendar, Award, Download, MessageCircle } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/components/ui/dialog';
import { useAuth } from '@core/contexts/AuthContext';
import TreeProgressTimeline from '@features/trees/components/TreeProgressTimeline';
import TreeTrackingMap from '@features/trees/components/TreeTrackingMap';
import TreeChat from '@features/trees/components/TreeChat';
import PlanterRating from '@modules/plantador/components/PlanterRating';

const TreeDetailsPage = () => {
  const { userId, treeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tree, setTree] = useState(null);
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchTreeDetails = async () => {
      try {
        setLoading(true);

        // Cargar detalles del árbol
        const treeRes = await api.get(`/trees/${treeId}`);
        setTree(treeRes.data.tree);

        // Cargar work order (todos los árboles tienen work order)
        try {
          const woRes = await api.get(`/work-orders?tree_id=${treeId}`);
          if (woRes.data.workOrders && woRes.data.workOrders.length > 0) {
            setWorkOrder(woRes.data.workOrders[0]);
          }
        } catch (err) {
          console.error('Error loading work order:', err);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading tree details:', err);
        setLoading(false);
      }
    };

    if (treeId) {
      fetchTreeDetails();
    }
  }, [treeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Árbol no encontrado</h2>
          <p className="text-gray-600 mb-6">No pudimos encontrar este árbol</p>
          <Button onClick={() => navigate(`/usuario/${userId}/arboles`)}>
            Volver a mis árboles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header con botón de regreso */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/usuario/${userId}/arboles`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis árboles
          </Button>

          <div className="flex items-center space-x-4">
            <TreePine className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tree.name || 'Árbol'}</h1>
              <p className="text-gray-600">{tree.country || 'Ubicación no especificada'}</p>
            </div>
            {tree.status && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                tree.status === 'plantado' || tree.status === 'verificado' ? 'bg-green-100 text-green-800' :
                tree.status === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {tree.status === 'sin_plantar' && '⏳ Sin Plantar'}
                {tree.status === 'en_proceso' && '🌱 En Proceso'}
                {tree.status === 'plantado' && '🌳 Plantado'}
                {tree.status === 'verificado' && '✅ Verificado'}
                {tree.status === 'cancelado' && '❌ Cancelado'}
              </span>
            )}
          </div>
        </div>

        {/* Sección de progreso de plantación - PRIMERO */}
        {workOrder && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Progreso de Plantación</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Barra de progreso visual */}
              {(() => {
                const statusToProgress = {
                  'pendiente_autorizacion': 1,
                  'autorizada': 2,
                  'asignada_vivero': 3,
                  'vivero_preparando': 4,
                  'planta_lista': 5,
                  'entregada_plantador': 6,
                  'plantador_en_camino': 7,
                  'plantando': 8,
                  'plantada': 9
                };

                const currentProgress = statusToProgress[workOrder.status] || 0;
                const percentage = Math.round((currentProgress / 9) * 100);

                return currentProgress > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {currentProgress} de 9 pasos ({percentage}%)
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ) : null;
              })()}

              <h3 className="text-sm font-semibold text-gray-700 mb-3">Historial de Progreso</h3>
              <TreeProgressTimeline workOrderId={workOrder.id} />
            </CardContent>
          </Card>
        )}

        {/* Grid de información */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Fecha de plantación</p>
                <p className="font-semibold text-gray-900">
                  {tree.planted_at
                    ? new Date(tree.planted_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'No especificada'}
                </p>
              </div>

              {tree.latitude && tree.longitude && (
                <div>
                  <p className="text-sm text-gray-600">Coordenadas</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {parseFloat(tree.latitude).toFixed(6)}, {parseFloat(tree.longitude).toFixed(6)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">ID del árbol</p>
                <p className="font-semibold text-gray-900">#{tree.id}</p>
              </div>

              {tree.dedication && (
                <div>
                  <p className="text-sm text-gray-600">Dedicatoria</p>
                  <p className="font-semibold text-gray-900 italic">"{tree.dedication}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Certificado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Descarga tu certificado digital de plantación
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`/certificado/${tree.id}`, '_blank')}
              >
                <Award className="h-4 w-4 mr-2" />
                Ver certificado
              </Button>
            </CardContent>
          </Card>

          {/* Impacto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TreePine className="h-5 w-5 mr-2 text-green-600" />
                Impacto Ambiental
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">CO₂ Capturado (estimado)</p>
                <p className="text-2xl font-bold text-green-600">~25 kg/año</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Oxígeno Producido</p>
                <p className="text-2xl font-bold text-blue-600">~100 kg/año</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mapa de ubicación */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Ubicación del Árbol
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tree.latitude && tree.longitude ? (
              <TreeTrackingMap tree={tree} workOrder={workOrder} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Ubicación no disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calificación del plantador */}
        {workOrder && workOrder.status === 'plantada' && workOrder.planter_id && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Califica al Plantador</CardTitle>
            </CardHeader>
            <CardContent>
              <PlanterRating
                workOrderId={workOrder.id}
                planterId={workOrder.planter_id}
                isOwner={true}
              />
            </CardContent>
          </Card>
        )}

        {/* Botón flotante de chat */}
        {workOrder && (
          <Dialog open={showChat} onOpenChange={setShowChat}>
            <DialogTrigger asChild>
              <Button
                className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full shadow-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 z-[9999] transition-all duration-200"
                size="icon"
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Chat con Plantador/Vivero</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <TreeChat workOrderId={workOrder.id} currentUserId={user?.id} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TreeDetailsPage;
