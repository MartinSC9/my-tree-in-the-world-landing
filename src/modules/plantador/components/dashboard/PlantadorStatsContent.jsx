import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import {
  TrendingUp, TreePine, Star, Trophy, DollarSign, Clock,
  Target, CheckCircle2, AlertCircle, Timer
} from 'lucide-react';
import { useToast } from '@shared/components/ui/use-toast';
import planterService from '../../services/planterService';

const PlantadorStatsContent = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [recentEarnings, setRecentEarnings] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
    loadEarnings();
  }, []);

  const loadStats = async () => {
    try {
      const data = await planterService.getStats();
      setStats(data.stats);
      setEarnings(data.earnings);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Si el endpoint aún no está implementado, usar datos por defecto
      setStats({
        total_orders_accepted: 0,
        total_orders_completed: 0,
        total_orders_cancelled: 0,
        average_rating: 0,
        total_trees_planted: 0,
        average_completion_time_hours: 0
      });
      setEarnings({
        total_orders: 0,
        total_earned: 0,
        total_paid: 0,
        total_pending: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEarnings = async () => {
    try {
      const data = await planterService.getEarnings({ limit: 10 });
      setRecentEarnings(data.earnings || []);
    } catch (error) {
      console.error('Error cargando historial:', error);
      setRecentEarnings([]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateCompletionRate = () => {
    if (!stats || stats.total_orders_accepted === 0) return 0;
    return Math.round((stats.total_orders_completed / stats.total_orders_accepted) * 100);
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      paid: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    };
    const labels = {
      pending: 'Pendiente',
      paid: 'Pagado',
      cancelled: 'Cancelado'
    };
    return { style: styles[status] || styles.pending, label: labels[status] || status };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Mis Estadísticas</h1>
        <p className="text-gray-600 mt-1">Tu rendimiento y ganancias como plantador</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Árboles Plantados</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_trees_planted || 0}</p>
              </div>
              <TreePine className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Órdenes Completadas</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_orders_completed || 0}</p>
                <p className="text-xs text-blue-100 mt-1">
                  de {stats?.total_orders_accepted || 0} aceptadas
                </p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Rating Promedio</p>
                <p className="text-3xl font-bold mt-1 flex items-center gap-1">
                  {stats?.average_rating?.toFixed(1) || '0.0'}
                  <Star className="h-6 w-6 fill-current" />
                </p>
              </div>
              <Star className="h-12 w-12 text-yellow-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tasa de Completado</p>
                <p className="text-3xl font-bold mt-1">{calculateCompletionRate()}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de Ganancias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Ganado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(earnings?.total_earned || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              En {earnings?.total_orders || 0} órdenes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Ya Pagado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(earnings?.total_paid || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Liquidaciones anteriores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Pendiente de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(earnings?.total_pending || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Próxima liquidación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Tiempo Promedio</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {stats?.average_completion_time_hours?.toFixed(1) || '0.0'}h
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Completadas</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {stats?.total_orders_completed || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium">Canceladas</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {stats?.total_orders_cancelled || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.total_trees_planted >= 10 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Trophy className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Plantador Activo</p>
                    <p className="text-xs text-green-600">Plantaste más de 10 árboles</p>
                  </div>
                </div>
              )}

              {stats?.average_rating >= 4.5 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Star className="h-8 w-8 text-yellow-600 fill-current" />
                  <div>
                    <p className="font-semibold text-yellow-800">Excelencia</p>
                    <p className="text-xs text-yellow-600">Rating superior a 4.5⭐</p>
                  </div>
                </div>
              )}

              {calculateCompletionRate() >= 95 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">Alta Efectividad</p>
                    <p className="text-xs text-blue-600">+95% de órdenes completadas</p>
                  </div>
                </div>
              )}

              {stats?.total_trees_planted < 10 && stats?.average_rating < 4.5 && calculateCompletionRate() < 95 && (
                <div className="text-center text-gray-500 py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>Completa más órdenes para desbloquear logros</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Ganancias Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ganancias Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEarnings.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p>No hay ganancias registradas aún</p>
              <p className="text-sm mt-1">Completa órdenes para ver tu historial</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEarnings.map((earning) => {
                const statusBadge = getPaymentStatusBadge(earning.payment_status);
                return (
                  <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Orden #{earning.work_order_id} - {earning.tree_name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>
                          {new Date(earning.completed_at).toLocaleDateString('es-AR')}
                        </span>
                        <span>Período: {earning.payment_period}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={statusBadge.style}>
                          {statusBadge.label}
                        </Badge>
                        {earning.payment_date && (
                          <span className="text-xs text-gray-500">
                            Pagado: {new Date(earning.payment_date).toLocaleDateString('es-AR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(earning.total_amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Base: {formatCurrency(earning.base_amount)}
                        {earning.distance_bonus > 0 && ` + ${formatCurrency(earning.distance_bonus)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantadorStatsContent;
