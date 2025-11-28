import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Clock, TreePine, CheckCircle, Leaf } from 'lucide-react';

const ViveroPreparationContent = () => {
  // Mock data - árboles en preparación
  const preparingTrees = [
    { id: 1, orderNumber: 'ORD-2024-012', species: 'Roble', quantity: 10, startDate: '2024-01-18', estimatedCompletion: '2024-01-25', progress: 65 },
    { id: 2, orderNumber: 'ORD-2024-013', species: 'Ceibo', quantity: 8, startDate: '2024-01-17', estimatedCompletion: '2024-01-24', progress: 80 },
    { id: 3, orderNumber: 'ORD-2024-014', species: 'Jacarandá', quantity: 12, startDate: '2024-01-16', estimatedCompletion: '2024-01-23', progress: 90 }
  ];

  const handleMarkAsReady = (id) => {
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">En Preparación</h1>
        <p className="text-gray-600 mt-1">Árboles siendo preparados para envío</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">En Preparación</p>
                <p className="text-3xl font-bold mt-1">{preparingTrees.length}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Árboles</p>
                <p className="text-3xl font-bold mt-1">{preparingTrees.reduce((sum, t) => sum + t.quantity, 0)}</p>
              </div>
              <TreePine className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {preparingTrees.map((tree) => (
          <Card key={tree.id} className="hover:shadow-lg transition-shadow">
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
                  </div>

                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Cantidad:</span> {tree.quantity} unidades</p>
                    <p><span className="font-medium text-gray-700">Iniciado:</span> {new Date(tree.startDate).toLocaleDateString('es-ES')}</p>
                    <p><span className="font-medium text-gray-700">Estimado:</span> {new Date(tree.estimatedCompletion).toLocaleDateString('es-ES')}</p>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso</span>
                      <span className="text-sm font-semibold text-green-600">{tree.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${tree.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                  <Button
                    onClick={() => handleMarkAsReady(tree.id)}
                    className="bg-green-600 hover:bg-green-700 flex-1 lg:flex-none"
                    disabled={tree.progress < 100}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {preparingTrees.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-gray-500">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No hay árboles en preparación</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViveroPreparationContent;
