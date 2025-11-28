import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle, TreePine, Star } from 'lucide-react';

const PlantadorCompletedContent = () => {
  const completedOrders = [
    { id: 1, orderNumber: 'ORD-2024-001', species: 'Roble', quantity: 25, location: 'Córdoba', date: '2024-01-12', rating: 5 },
    { id: 2, orderNumber: 'ORD-2024-005', species: 'Pino', quantity: 18, location: 'Villa Carlos Paz', date: '2024-01-10', rating: 5 },
    { id: 3, orderNumber: 'ORD-2024-010', species: 'Ceibo', quantity: 12, location: 'Alta Gracia', date: '2024-01-08', rating: 4 },
    { id: 4, orderNumber: 'ORD-2024-015', species: 'Eucalipto', quantity: 30, location: 'Jesús María', date: '2024-01-05', rating: 5 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Completadas</h1>
        <p className="text-gray-600 mt-1">Historial de plantaciones finalizadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completadas</p>
                <p className="text-3xl font-bold mt-1">{completedOrders.length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Árboles Plantados</p>
                <p className="text-3xl font-bold mt-1">{completedOrders.reduce((sum, o) => sum + o.quantity, 0)}</p>
              </div>
              <TreePine className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Calificación</p>
                <p className="text-3xl font-bold mt-1">{(completedOrders.reduce((sum, o) => sum + o.rating, 0) / completedOrders.length).toFixed(1)}</p>
              </div>
              <Star className="h-12 w-12 text-yellow-200 opacity-80 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Historial de Plantaciones</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-700">Orden</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Especie</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Cantidad</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Ubicación</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Fecha</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.orderNumber}</td>
                    <td className="p-3">{order.species}</td>
                    <td className="p-3 text-center font-semibold">{order.quantity}</td>
                    <td className="p-3">{order.location}</td>
                    <td className="p-3 text-center">{new Date(order.date).toLocaleDateString('es-ES')}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < order.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}/>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantadorCompletedContent;
