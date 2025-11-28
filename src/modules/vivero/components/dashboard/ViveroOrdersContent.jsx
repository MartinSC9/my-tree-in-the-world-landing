import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/components/ui/dialog';
import { Textarea } from '@shared/components/ui/textarea';
import { Label } from '@shared/components/ui/label';
import { ClipboardList, CheckCircle, Clock, TreePine, User, MapPin, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import viveroService from '../../../../services/viveroService';

const ViveroOrdersContent = ({ nurseryId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptDialog, setAcceptDialog] = useState({ open: false, order: null });
  const [preparationDays, setPreparationDays] = useState(3);
  const [accepting, setAccepting] = useState(false);
  const [rejectDialog, setRejectDialog] = useState({ open: false, order: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    if (nurseryId) loadOrders();
  }, [nurseryId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      orders.forEach(order => {
        if (order.nursery_response_deadline) {
          newCountdowns[order.id] = viveroService.getTimeUntilDeadline(order.nursery_response_deadline);
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await viveroService.getPendingOrders(nurseryId);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    if (!acceptDialog.order) return;
    try {
      setAccepting(true);
      await viveroService.acceptOrder(acceptDialog.order.id, preparationDays);
      toast.success(`Orden aceptada! Preparación en ${preparationDays} días`);
      setAcceptDialog({ open: false, order: null });
      await loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al aceptar');
    } finally {
      setAccepting(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectDialog.order || rejectionReason.trim().length < 10) {
      toast.error('La razón debe tener al menos 10 caracteres');
      return;
    }
    try {
      setRejecting(true);
      await viveroService.rejectOrder(rejectDialog.order.id, rejectionReason);
      toast.success('Orden rechazada');
      setRejectDialog({ open: false, order: null });
      await loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al rechazar');
    } finally {
      setRejecting(false);
    }
  };

  const getUrgencyColor = (secondsRemaining) => {
    const urgency = viveroService.getUrgencyLevel(secondsRemaining);
    switch(urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'normal': return 'bg-green-100 text-green-800 border-green-300';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Órdenes Pendientes</h1>
        <p className="text-gray-600 mt-1">
          Tienes <span className="font-bold text-red-600">2 HORAS</span> para responder cada orden
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pendientes</p>
                <p className="text-3xl font-bold mt-1">{orders.length}</p>
              </div>
              <ClipboardList className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Críticas (&lt;30min)</p>
                <p className="text-3xl font-bold mt-1">
                  {orders.filter(o => {
                    const c = countdowns[o.id];
                    return c && !c.expired && (c.hours === 0 && c.minutes < 30);
                  }).length}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Árboles</p>
                <p className="text-3xl font-bold mt-1">{orders.length}</p>
              </div>
              <TreePine className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => {
          const countdown = countdowns[order.id];
          const secondsRemaining = countdown ?
            (countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds) :
            order.seconds_until_deadline || 0;

          return (
            <Card
              key={order.id}
              className={`hover:shadow-lg transition-all border-2 ${countdown?.expired ? 'opacity-50 bg-gray-50' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Orden #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString('es-ES')}
                        </p>
                      </div>

                      <div className={`px-4 py-2 rounded-lg border-2 ${getUrgencyColor(secondsRemaining)}`}>
                        {countdown?.expired ? (
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            <span className="font-bold text-sm">EXPIRADO</span>
                          </div>
                        ) : countdown ? (
                          <div className="text-center">
                            <div className="text-xs font-medium">Restante</div>
                            <div className="text-lg font-bold">
                              {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TreePine className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">
                          <span className="font-medium">{order.tree_name}</span>
                          {order.species && ` (${order.species})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{order.user_name}</span>
                      </div>
                      {order.payment_amount && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">
                            Pago: <span className="font-bold text-green-700">
                              ${parseFloat(order.payment_amount).toLocaleString()}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!countdown?.expired && (
                    <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                      <Button
                        onClick={() => { setAcceptDialog({ open: true, order }); setPreparationDays(3); }}
                        className="bg-green-600 hover:bg-green-700 flex-1 lg:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button
                        onClick={() => { setRejectDialog({ open: true, order }); setRejectionReason(''); }}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 flex-1 lg:flex-none"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-gray-500">
              <ClipboardList className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No hay órdenes pendientes</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={acceptDialog.open} onOpenChange={(open) => setAcceptDialog({ open, order: acceptDialog.order })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aceptar Orden #{acceptDialog.order?.id}</DialogTitle>
            <DialogDescription>
              ¿Cuántos días necesitas para preparar el árbol? (1-5 días)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Días de preparación</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(days => (
                  <Button
                    key={days}
                    variant={preparationDays === days ? 'default' : 'outline'}
                    onClick={() => setPreparationDays(days)}
                    className={preparationDays === days ? 'bg-green-600' : ''}
                  >
                    {days}d
                  </Button>
                ))}
              </div>
            </div>

            {acceptDialog.order?.payment_amount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                <div className="flex justify-between">
                  <span>Precio:</span>
                  <span className="font-bold">${parseFloat(acceptDialog.order.payment_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Comisión (15%):</span>
                  <span>-${(parseFloat(acceptDialog.order.payment_amount) * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-700 border-t mt-2 pt-2">
                  <span>Tu ganancia:</span>
                  <span>${(parseFloat(acceptDialog.order.payment_amount) * 0.85).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialog({ open: false, order: null })} disabled={accepting}>
              Cancelar
            </Button>
            <Button onClick={handleAcceptOrder} disabled={accepting} className="bg-green-600">
              {accepting ? 'Aceptando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, order: rejectDialog.order })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Orden #{rejectDialog.order?.id}</DialogTitle>
            <DialogDescription>Explica por qué (mínimo 10 caracteres)</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Razón</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ej: No tenemos stock..."
                rows={3}
              />
              <p className="text-xs text-gray-500">{rejectionReason.length}/10 mínimo</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, order: null })} disabled={rejecting}>
              Cancelar
            </Button>
            <Button
              onClick={handleRejectOrder}
              disabled={rejecting || rejectionReason.trim().length < 10}
              variant="destructive"
            >
              {rejecting ? 'Rechazando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViveroOrdersContent;
