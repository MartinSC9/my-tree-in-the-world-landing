import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Sprout, Clock, CheckCircle, TrendingUp, MapPin, Star } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { DashboardStatsGrid } from '@shared/components/StatCard';

const PlantadorDashboardContent = () => {
  const stats = {
    pendingOrders: 8,
    activeOrders: 5,
    completedOrders: 42,
    averageRating: 4.8,
    totalTrees: 387
  };

  const statsCards = [
    { label: 'Pendientes', value: stats.pendingOrders, icon: Clock, color: 'orange' },
    { label: 'En Proceso', value: stats.activeOrders, icon: Sprout, color: 'blue' },
    { label: 'Completadas', value: stats.completedOrders, icon: CheckCircle, color: 'green' },
    { label: 'Total Plantados', value: stats.totalTrees, icon: TrendingUp, color: 'purple' },
    { label: 'Calificación', value: `${stats.averageRating} ★`, icon: Star, color: 'amber' },
  ];

  const recentActivity = [
    { id: 1, type: 'completed', message: 'Orden #2847 completada: 15 Robles plantados', time: 'Hace 2 horas', icon: CheckCircle, color: 'green' },
    { id: 2, type: 'started', message: 'Iniciada plantación: 20 Pinos - Córdoba', time: 'Hace 5 horas', icon: Sprout, color: 'blue' },
    { id: 3, type: 'new', message: 'Nueva orden recibida: 12 Ceibos', time: 'Hace 1 día', icon: Clock, color: 'orange' },
    { id: 4, type: 'rating', message: 'Nueva calificación recibida: 5 estrellas', time: 'Hace 2 días', icon: Star, color: 'yellow' }
  ];

  const upcomingTasks = [
    { id: 1, location: 'Córdoba Centro', trees: 25, species: 'Roble', date: 'Mañana' },
    { id: 2, location: 'Villa Carlos Paz', trees: 18, species: 'Pino', date: 'En 2 días' },
    { id: 3, location: 'Alta Gracia', trees: 30, species: 'Eucalipto', date: 'En 4 días' }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Mi Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen de tu actividad como plantador</p>
      </div>

      {/* Stats Grid */}
      <DashboardStatsGrid stats={statsCards} columns={6} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${colorClasses[activity.color]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Plantaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Próximas Plantaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{task.location}</p>
                      <p className="text-sm text-gray-600">{task.trees}x {task.species}</p>
                    </div>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {task.date}
                    </span>
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-orange-600 hover:bg-orange-700 h-auto py-4">
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-6 w-6" />
                <span>Ver Pendientes</span>
              </div>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-auto py-4">
              <div className="flex flex-col items-center gap-2">
                <Sprout className="h-6 w-6" />
                <span>Plantaciones Activas</span>
              </div>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 h-auto py-4">
              <div className="flex flex-col items-center gap-2">
                <MapPin className="h-6 w-6" />
                <span>Ver Mapa</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantadorDashboardContent;
