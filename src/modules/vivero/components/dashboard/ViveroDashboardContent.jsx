import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Leaf, Package, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { DashboardStatsGrid } from '@shared/components/StatCard';

const ViveroDashboardContent = () => {
  const stats = {
    totalInventory: 1250,
    ordersReceived: 18,
    inPreparation: 12,
    readyToShip: 6,
    monthlyGrowth: 15
  };

  const statsCards = [
    { label: 'Inventario Total', value: stats.totalInventory, icon: Leaf, color: 'green' },
    { label: 'Órdenes Recibidas', value: stats.ordersReceived, icon: Package, color: 'blue' },
    { label: 'En Preparación', value: stats.inPreparation, icon: Clock, color: 'orange' },
    { label: 'Listos para Envío', value: stats.readyToShip, icon: CheckCircle, color: 'purple' },
  ];

  const recentActivity = [
    { id: 1, type: 'order', message: 'Nueva orden recibida: Roble #2847', time: 'Hace 15 min', icon: Package, color: 'blue' },
    { id: 2, type: 'ready', message: 'Árbol listo para envío: Pino #2834', time: 'Hace 1 hora', icon: CheckCircle, color: 'green' },
    { id: 3, type: 'preparation', message: 'Iniciada preparación: Ceibo #2841', time: 'Hace 2 horas', icon: Clock, color: 'orange' },
    { id: 4, type: 'alert', message: 'Bajo stock: Algarrobo (5 unidades)', time: 'Hace 3 horas', icon: AlertCircle, color: 'red' }
  ];

  const popularSpecies = [
    { name: 'Roble', count: 320, trend: '+12%' },
    { name: 'Pino', count: 280, trend: '+8%' },
    { name: 'Ceibo', count: 210, trend: '+15%' },
    { name: 'Algarrobo', count: 150, trend: '-3%' }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Panel Principal - Vivero</h1>
        <p className="text-gray-600 mt-1">Vista general de tu vivero</p>
      </div>

      {/* Stats Grid */}
      <DashboardStatsGrid stats={statsCards} columns={4} />

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

        {/* Especies Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Especies Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularSpecies.map((species, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{species.name}</p>
                      <p className="text-sm text-gray-500">{species.count} unidades</p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${species.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {species.trend}
                  </div>
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
            <Button className="bg-green-600 hover:bg-green-700 h-auto py-4">
              <div className="flex flex-col items-center gap-2">
                <Package className="h-6 w-6" />
                <span>Ver Órdenes</span>
              </div>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-auto py-4">
              <div className="flex flex-col items-center gap-2">
                <Leaf className="h-6 w-6" />
                <span>Gestionar Inventario</span>
              </div>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 h-auto py-4">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>Preparar Envíos</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViveroDashboardContent;
