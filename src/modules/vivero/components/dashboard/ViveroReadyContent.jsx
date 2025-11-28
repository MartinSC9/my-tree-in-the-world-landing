import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { CheckCircle, TreePine, Truck, Leaf, MapPin } from 'lucide-react';

const ViveroReadyContent = () => {
  // Mock data - árboles listos para envío
  const readyTrees = [
    { id: 1, orderNumber: 'ORD-2024-008', species: 'Pino', quantity: 20, completedDate: '2024-01-16', destination: 'Buenos Aires', planter: 'Juan Fernández' },
    { id: 2, orderNumber: 'ORD-2024-009', species: 'Roble', quantity: 15, completedDate: '2024-01-15', destination: 'Córdoba', planter: 'María López' },
    { id: 3, orderNumber: 'ORD-2024-010', species: 'Eucalipto', quantity: 25, completedDate: '2024-01-14', destination: 'Mendoza', planter: 'Carlos Gómez' },
    { id: 4, orderNumber: 'ORD-2024-011', species: 'Sauce', quantity: 18, completedDate: '2024-01-13', destination: 'Santa Fe', planter: 'Ana Torres' }
  ];

  const handleDispatch = (id) => {
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Listos para Envío</h1>
        <p className="text-gray-600 mt-1">Árboles preparados y listos para ser despachados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Órdenes Listas</p>
                <p className="text-3xl font-bold mt-1">{readyTrees.length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Árboles</p>
                <p className="text-3xl font-bold mt-1">{readyTrees.reduce((sum, t) => sum + t.quantity, 0)}</p>
              </div>
              <TreePine className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {readyTrees.map((tree) => (
          <Card key={tree.id} className="hover:shadow-lg transition-shadow border-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tree.species}</h3>
                      <p className="text-sm text-gray-500">{tree.orderNumber}</p>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✓ Listo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Cantidad:</span>
                      <span className="ml-2 text-gray-900">{tree.quantity} unidades</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-900">{tree.destination}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Plantador:</span>
                      <span className="ml-2 text-gray-900">{tree.planter}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Completado el {new Date(tree.completedDate).toLocaleDateString('es-ES')}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                  <Button
                    onClick={() => handleDispatch(tree.id)}
                    className="bg-blue-600 hover:bg-blue-700 flex-1 lg:flex-none"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Despachar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {readyTrees.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-gray-500">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No hay árboles listos para envío</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViveroReadyContent;
