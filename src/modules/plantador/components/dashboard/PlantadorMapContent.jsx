import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { MapPin } from 'lucide-react';

const PlantadorMapContent = () => {
  const zones = [
    { id: 1, name: 'Córdoba Centro', activeOrders: 3, totalTrees: 45, coordinates: '-31.4201, -64.1888' },
    { id: 2, name: 'Villa Carlos Paz', activeOrders: 2, totalTrees: 33, coordinates: '-31.4220, -64.4970' },
    { id: 3, name: 'Alta Gracia', activeOrders: 1, totalTrees: 12, coordinates: '-31.6520, -64.4300' },
    { id: 4, name: 'Jesús María', activeOrders: 0, totalTrees: 30, coordinates: '-30.9820, -64.0970' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Mapa de Zonas</h1>
        <p className="text-gray-600 mt-1">Ubicaciones de plantación asignadas</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Zonas de Trabajo</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                        <p className="text-xs text-gray-500">{zone.coordinates}</p>
                      </div>
                    </div>
                    {zone.activeOrders > 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {zone.activeOrders} activas
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Órdenes activas:</span>
                      <p className="font-semibold text-gray-900">{zone.activeOrders}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total árboles:</span>
                      <p className="font-semibold text-gray-900">{zone.totalTrees}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> El mapa interactivo con ubicaciones en tiempo real estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantadorMapContent;
