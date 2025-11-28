import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { Clock, TreePine, MapPin, DollarSign, AlertCircle, Star, Navigation, CheckCircle2 } from 'lucide-react';
import { useToast } from '@shared/components/ui/use-toast';
import planterService from '../../services/planterService';

const PlantadorPendingContent = () => {
  const [loading, setLoading] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [planterInfo, setPlanterInfo] = useState(null);
  const [claiming, setClaiming] = useState(null);
  const { toast } = useToast();

  // Cargar órdenes disponibles
  useEffect(() => {
    loadAvailableOrders();
  }, []);

  const loadAvailableOrders = async () => {
    try {
      setLoading(true);
      const data = await planterService.getAvailableOrders();
      setAvailableOrders(data.workOrders || []);
      setPlanterInfo(data.planter);

      // Mostrar mensaje de prioridad si hay delay
      if (data.planter?.delay_minutes > 0) {
        toast({
          title: "Sistema de Prioridad por Rating",
          description: data.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudieron cargar las órdenes disponibles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrder = async (orderId) => {
    try {
      setClaiming(orderId);
      const result = await planterService.claimOrder(orderId);

      toast({
        title: "¡Orden Tomada!",
        description: result.message,
        duration: 5000,
      });

      // Mostrar advertencia de timeout
      if (result.warning) {
        setTimeout(() => {
          toast({
            title: "Recordatorio",
            description: result.warning,
            variant: "warning",
          });
        }, 2000);
      }

      // Recargar órdenes después de tomar una
      await loadAvailableOrders();

      // Redirigir a órdenes activas o recargar
      window.location.reload();
    } catch (error) {
      console.error('Error tomando orden:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.response?.data?.error || "No se pudo tomar la orden",
        variant: "destructive",
      });
    } finally {
      setClaiming(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (level) => {
    switch(level) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Media';
      case 'hard': return 'Difícil';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando órdenes disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Pool de Órdenes Disponibles</h1>
        <p className="text-gray-600 mt-1">
          Sistema de prioridad tipo Rappi - Primero en tomar se queda con la orden
        </p>
      </div>

      {/* Información del Plantador */}
      {planterInfo && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <div>
                  <p className="font-semibold text-gray-800">Tu Rating: {planterInfo.rating.toFixed(1)} ⭐</p>
                  <p className="text-sm text-gray-600">
                    {planterInfo.delay_minutes === 0
                      ? "🎉 Acceso prioritario a todas las órdenes"
                      : `⏱️ Delay de ${planterInfo.delay_minutes} minutos para ver órdenes`
                    }
                  </p>
                </div>
              </div>
              {planterInfo.has_zone_config && (
                <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">
                  <Navigation className="h-3 w-3 mr-1" />
                  Zona configurada
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Órdenes Disponibles</p>
                <p className="text-3xl font-bold mt-1">{availableOrders.length}</p>
              </div>
              <TreePine className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pago Promedio</p>
                <p className="text-3xl font-bold mt-1">
                  {availableOrders.length > 0
                    ? formatCurrency(availableOrders.reduce((sum, o) => sum + o.total_payment, 0) / availableOrders.length)
                    : '$0'}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Ganancia Potencial</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(availableOrders.reduce((sum, o) => sum + o.total_payment, 0))}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Órdenes */}
      {availableOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay órdenes disponibles en este momento
            </h3>
            <p className="text-gray-500">
              Las órdenes aparecerán aquí cuando estén autorizadas y disponibles para tomar.
            </p>
            <Button
              onClick={loadAvailableOrders}
              variant="outline"
              className="mt-4"
            >
              <Clock className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {availableOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-green-800">
                      {order.tree_species} ({order.tree_name})
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getDifficultyColor(order.difficulty_level)}>
                        {getDifficultyLabel(order.difficulty_level)}
                      </Badge>
                      {order.is_urgent && (
                        <Badge variant="destructive" className="bg-red-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgente
                        </Badge>
                      )}
                      {order.within_zone && (
                        <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">
                          <MapPin className="h-3 w-3 mr-1" />
                          En tu zona
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(order.total_payment)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pago total</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Ubicaciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">Vivero de origen</p>
                      <p className="text-sm text-gray-600 truncate">{order.nursery_name}</p>
                      <p className="text-xs text-gray-500 truncate">{order.nursery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Navigation className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">Ubicación de plantación</p>
                      <p className="text-xs text-gray-500">
                        {order.tree_latitude.toFixed(6)}, {order.tree_longitude.toFixed(6)}
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        Distancia: {order.distance_km} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desglose de Pago */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">💰 Desglose de pago:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pago base:</span>
                      <span className="font-semibold">{formatCurrency(order.base_payment)}</span>
                    </div>
                    {order.distance_bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bono distancia ({order.distance_km}km):</span>
                        <span className="font-semibold text-green-600">+{formatCurrency(order.distance_bonus)}</span>
                      </div>
                    )}
                    {order.urgency_bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bono urgencia:</span>
                        <span className="font-semibold text-orange-600">+{formatCurrency(order.urgency_bonus)}</span>
                      </div>
                    )}
                    {order.complexity_bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bono complejidad:</span>
                        <span className="font-semibold text-blue-600">+{formatCurrency(order.complexity_bonus)}</span>
                      </div>
                    )}
                    {order.schedule_bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bono horario:</span>
                        <span className="font-semibold text-purple-600">+{formatCurrency(order.schedule_bonus)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fecha estimada */}
                {order.estimated_planting_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Fecha estimada: {new Date(order.estimated_planting_date).toLocaleDateString('es-AR')}</span>
                  </div>
                )}

                {/* Botón de acción */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    onClick={() => handleClaimOrder(order.id)}
                    disabled={claiming === order.id}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    size="lg"
                  >
                    {claiming === order.id ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Tomando orden...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        TOMAR ORDEN
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-gray-500 text-right">
                    <p>Primero en tomar</p>
                    <p>se queda con la orden</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Botón de actualización */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={loadAvailableOrders}
          variant="outline"
          disabled={loading}
        >
          <Clock className="h-4 w-4 mr-2" />
          Actualizar órdenes
        </Button>
      </div>
    </div>
  );
};

export default PlantadorPendingContent;
