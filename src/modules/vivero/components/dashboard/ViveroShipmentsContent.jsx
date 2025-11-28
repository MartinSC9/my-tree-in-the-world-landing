import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { Truck, TreePine, MapPin, Calendar, Search, Package } from 'lucide-react';

const ViveroShipmentsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - historial de envíos
  const shipments = [
    { id: 1, orderNumber: 'ORD-2024-001', species: 'Roble', quantity: 25, destination: 'Córdoba', planter: 'Juan Pérez', dispatchDate: '2024-01-12', status: 'Entregado' },
    { id: 2, orderNumber: 'ORD-2024-002', species: 'Pino', quantity: 40, destination: 'Buenos Aires', planter: 'María González', dispatchDate: '2024-01-10', status: 'En Tránsito' },
    { id: 3, orderNumber: 'ORD-2024-003', species: 'Ceibo', quantity: 15, destination: 'Santa Fe', planter: 'Carlos Rodríguez', dispatchDate: '2024-01-08', status: 'Entregado' },
    { id: 4, orderNumber: 'ORD-2024-004', species: 'Eucalipto', quantity: 30, destination: 'Mendoza', planter: 'Ana Martínez', dispatchDate: '2024-01-05', status: 'Entregado' },
    { id: 5, orderNumber: 'ORD-2024-005', species: 'Jacarandá', quantity: 20, destination: 'Tucumán', planter: 'Pedro Sánchez', dispatchDate: '2024-01-03', status: 'Entregado' }
  ];

  const filteredShipments = shipments.filter(s =>
    s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalShipped = shipments.reduce((sum, s) => sum + s.quantity, 0);
  const inTransit = shipments.filter(s => s.status === 'En Tránsito').length;
  const delivered = shipments.filter(s => s.status === 'Entregado').length;

  const getStatusColor = (status) => {
    return status === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Historial de Envíos</h1>
        <p className="text-gray-600 mt-1">Seguimiento de despachos realizados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Enviados</p>
                <p className="text-3xl font-bold mt-1">{totalShipped}</p>
              </div>
              <TreePine className="h-12 w-12 text-purple-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">En Tránsito</p>
                <p className="text-3xl font-bold mt-1">{inTransit}</p>
              </div>
              <Truck className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Entregados</p>
                <p className="text-3xl font-bold mt-1">{delivered}</p>
              </div>
              <Package className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por orden, especie o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Despachos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-700">Orden</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Especie</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Cantidad</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Destino</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Plantador</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Fecha Despacho</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium text-gray-900">{shipment.orderNumber}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <TreePine className="h-4 w-4 text-green-600" />
                        <span className="text-gray-900">{shipment.species}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900">{shipment.quantity}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-900">{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700">{shipment.planter}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{new Date(shipment.dispatchDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredShipments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Truck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron envíos que coincidan con tu búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViveroShipmentsContent;
