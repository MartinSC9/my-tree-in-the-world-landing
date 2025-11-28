import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Leaf, Search, Plus, Edit, Trash2, AlertTriangle, Package } from 'lucide-react';

const ViveroInventoryContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - inventario de árboles
  const inventoryItems = [
    { id: 1, species: 'Roble', scientificName: 'Quercus robur', quantity: 320, minStock: 50, age: '2-3 años', height: '1.5-2m', status: 'Disponible' },
    { id: 2, species: 'Pino', scientificName: 'Pinus sylvestris', quantity: 280, minStock: 40, age: '1-2 años', height: '1-1.5m', status: 'Disponible' },
    { id: 3, species: 'Ceibo', scientificName: 'Erythrina crista-galli', quantity: 210, minStock: 30, age: '2-3 años', height: '1.2-1.8m', status: 'Disponible' },
    { id: 4, species: 'Algarrobo', scientificName: 'Prosopis alba', quantity: 5, minStock: 25, age: '3-4 años', height: '2-2.5m', status: 'Stock Bajo' },
    { id: 5, species: 'Jacarandá', scientificName: 'Jacaranda mimosifolia', quantity: 180, minStock: 35, age: '1-2 años', height: '1-1.5m', status: 'Disponible' },
    { id: 6, species: 'Sauce', scientificName: 'Salix babylonica', quantity: 95, minStock: 20, age: '2-3 años', height: '1.5-2m', status: 'Disponible' },
    { id: 7, species: 'Arce', scientificName: 'Acer saccharum', quantity: 15, minStock: 30, age: '2-3 años', height: '1.2-1.8m', status: 'Stock Bajo' },
    { id: 8, species: 'Eucalipto', scientificName: 'Eucalyptus globulus', quantity: 240, minStock: 50, age: '1-2 años', height: '1.5-2.5m', status: 'Disponible' }
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTrees = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventoryItems.filter(item => item.quantity < item.minStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Inventario</h1>
          <p className="text-gray-600 mt-1">Gestiona el stock de árboles disponibles</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Especie
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total de Árboles</p>
                <p className="text-3xl font-bold mt-1">{totalTrees}</p>
              </div>
              <Leaf className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Especies Diferentes</p>
                <p className="text-3xl font-bold mt-1">{inventoryItems.length}</p>
              </div>
              <Package className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Stock Bajo</p>
                <p className="text-3xl font-bold mt-1">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por especie o nombre científico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-700">Especie</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Nombre Científico</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Cantidad</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Stock Mínimo</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Edad</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Altura</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Estado</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Leaf className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.species}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 italic text-sm">{item.scientificName}</td>
                    <td className="p-3 text-center">
                      <span className={`font-semibold ${item.quantity < item.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-600">{item.minStock}</td>
                    <td className="p-3 text-center text-gray-600">{item.age}</td>
                    <td className="p-3 text-center text-gray-600">{item.height}</td>
                    <td className="p-3 text-center">
                      {item.quantity < item.minStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Disponible
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Leaf className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron especies que coincidan con tu búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViveroInventoryContent;
