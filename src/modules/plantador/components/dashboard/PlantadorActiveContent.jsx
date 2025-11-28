import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Progress } from '@shared/components/ui/progress';
import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { Textarea } from '@shared/components/ui/textarea';
import { Input } from '@shared/components/ui/input';
import {
  Clock, TreePine, MapPin, Navigation, Upload, CheckCircle2,
  AlertCircle, Camera, FileText, MapPinned, TruckIcon
} from 'lucide-react';
import { useToast } from '@shared/components/ui/use-toast';
import planterService from '../../services/planterService';
import workOrderService from '@/modules/admin/services/workOrderService';

const PlantadorActiveContent = () => {
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completingOrder, setCompletingOrder] = useState(null);
  const [photoUrls, setPhotoUrls] = useState(['', '', '']);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadActiveOrders();
  }, []);

  const loadActiveOrders = async () => {
    try {
      setLoading(true);
      const orders = await planterService.getMyActiveOrders();
      setActiveOrders(orders);
    } catch (error) {
      console.error('Error cargando órdenes activas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes activas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrderProgress = (status) => {
    const statusFlow = {
      'entregada_plantador': 33,
      'plantador_en_camino': 66,
      'plantando': 90,
      'plantada': 100
    };
    return statusFlow[status] || 0;
  };

  const getNextAction = (status) => {
    const actions = {
      'entregada_plantador': {
        label: 'Iniciar Viaje a Plantación',
        action: 'start-travel',
        icon: TruckIcon,
        color: 'blue'
      },
      'plantador_en_camino': {
        label: 'Iniciar Plantación',
        action: 'start-planting',
        icon: TreePine,
        color: 'green'
      },
      'plantando': {
        label: 'Completar y Subir Evidencia',
        action: 'complete',
        icon: Camera,
        color: 'green'
      }
    };
    return actions[status];
  };

  const handleWorkflowAction = async (orderId, action) => {
    try {
      let result;
      switch(action) {
        case 'start-travel':
          result = await planterService.startTravel(orderId);
          break;
        case 'start-planting':
          result = await planterService.startPlanting(orderId);
          break;
        default:
          return;
      }

      toast({
        title: "Éxito",
        description: result.message,
      });

      await loadActiveOrders();
    } catch (error) {
      console.error('Error en acción:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo completar la acción",
        variant: "destructive",
      });
    }
  };

  const handleCompleteOrder = async (orderId) => {
    // TODO: Cuando se implemente upload de imágenes, descomentar validación:
    //     // Validar fotos
    //     const validPhotos = photoUrls.filter(url => url.trim() !== '');
    //     if (validPhotos.length < 3) {
    //       toast({
    //         title: "Fotos requeridas",
    //         description: "Debes subir mínimo 3 fotos para completar la orden",
    //         variant: "destructive",
    //       });
    //       return;
    //     }
    // Por ahora: fotos opcionales (filtrar URLs vacías)
    const validPhotos = photoUrls.filter(url => url && url.trim() !== '');

    try {
      setCompletingOrder(orderId);

      // Obtener ubicación GPS actual
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      const result = await planterService.completeOrder(orderId, {
        photo_urls: validPhotos,
        actual_latitude: position.coords.latitude,
        actual_longitude: position.coords.longitude,
        planting_notes: notes
      });

      toast({
        title: "¡Orden Completada!",
        description: `Has ganado ${result.earnings.total} ARS. Pago programado para ${new Date(result.earnings.payment_date).toLocaleDateString('es-AR')}`,
        duration: 8000,
      });

      // Limpiar formulario
      setPhotoUrls(['', '', '']);
      setNotes('');
      setCompletingOrder(null);

      // Recargar órdenes
      await loadActiveOrders();

    } catch (error) {
      console.error('Error completando orden:', error);

      if (error.message === 'User denied Geolocation') {
        toast({
          title: "GPS Requerido",
          description: "Debes permitir el acceso a tu ubicación para completar la plantación",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "No se pudo completar la orden",
          variant: "destructive",
        });
      }
      setCompletingOrder(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'entregada_plantador': 'Retirando árbol del vivero',
      'plantador_en_camino': 'Viajando a ubicación',
      'plantando': 'Plantando árbol',
      'plantada': 'Completada'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando órdenes activas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Órdenes Activas</h1>
        <p className="text-gray-600 mt-1">Órdenes en proceso de plantación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Órdenes en Progreso</p>
                <p className="text-3xl font-bold mt-1">{activeOrders.length}</p>
              </div>
              <TreePine className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Ganancia en Proceso</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(activeOrders.reduce((sum, o) => sum + (o.total_payment || 0), 0))}
                </p>
              </div>
              <TreePine className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Órdenes Activas */}
      {activeOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes órdenes activas
            </h3>
            <p className="text-gray-500">
              Toma una orden del pool para comenzar a trabajar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order) => {
            const nextAction = getNextAction(order.status);
            const progress = getOrderProgress(order.status);
            const showCompletionForm = order.status === 'plantando';

            return (
              <Card key={order.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-green-800">
                        {order.tree_name} - Orden #{order.id}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-blue-600">
                          {getStatusLabel(order.status)}
                        </Badge>
                        {order.is_urgent && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(order.total_payment || 0)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progreso</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Tiempo de claim */}
                  {order.claimed_at && order.claim_expires_at && order.status === 'entregada_plantador' && (
                    <Alert className="bg-orange-50 border-orange-300">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        ⏰ Tienes hasta {new Date(order.claim_expires_at).toLocaleTimeString('es-AR')} para confirmar retiro o la orden se liberará automáticamente
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Ubicación */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Vivero</p>
                        <p className="text-xs text-gray-600">{order.nursery_address || 'Ver en mapa'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Destino</p>
                        <p className="text-xs text-gray-600">
                          {order.actual_latitude?.toFixed(6) || 'Pendiente'}, {order.actual_longitude?.toFixed(6) || 'Pendiente'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de completación */}
                  {showCompletionForm && (
                    <div className="border-t pt-4 mt-4 space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Evidencia de Plantación
                      </h3>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Fotos opcionales (hasta implementar upload): General, Detalle y Panorámica
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        {[0, 1, 2].map((index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Foto {index + 1} (opcional) {index === 0 && '(General)'} {index === 1 && '(Detalle)'} {index === 2 && '(Panorámica)'}
                            </label>
                            <Input
                              type="url"
                              placeholder="https://ejemplo.com/foto.jpg"
                              value={photoUrls[index]}
                              onChange={(e) => {
                                const newUrls = [...photoUrls];
                                newUrls[index] = e.target.value;
                                setPhotoUrls(newUrls);
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas de plantación (opcional)
                        </label>
                        <Textarea
                          placeholder="Ej: Suelo en buenas condiciones, clima favorable..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Alert className="bg-blue-50 border-blue-300">
                        <MapPinned className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Al completar, se capturará automáticamente tu ubicación GPS actual
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Botón de acción */}
                  {nextAction && (
                    <Button
                      onClick={() => {
                        if (nextAction.action === 'complete') {
                          handleCompleteOrder(order.id);
                        } else {
                          handleWorkflowAction(order.id, nextAction.action);
                        }
                      }}
                      disabled={completingOrder === order.id}
                      className={`w-full bg-${nextAction.color}-600 hover:bg-${nextAction.color}-700`}
                      size="lg"
                    >
                      {completingOrder === order.id ? (
                        <>
                          <Clock className="h-5 w-5 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <nextAction.icon className="h-5 w-5 mr-2" />
                          {nextAction.label}
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlantadorActiveContent;
