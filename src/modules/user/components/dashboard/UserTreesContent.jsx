import React, { useState, useEffect } from 'react';
import { TreePine, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useAuth } from '@core/contexts/AuthContext';
import { useTree } from '@core/contexts/TreeContext';

/**
 * Componente de contenido para la sección de árboles del usuario
 * Este es un ejemplo de cómo estructurar los componentes de contenido
 */
const UserTreesContent = () => {
  const { user } = useAuth();
  const { trees, loading, fetchUserTrees } = useTree();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchUserTrees(user.id);
    }
  }, [user?.id]);

  const filteredTrees = trees.filter(tree => {
    const matchesSearch = tree.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || tree.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Árboles</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y rastrea tus árboles plantados
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Plantar Árbol
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Árboles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Plantados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {trees.filter(t => t.status === 'plantado').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {trees.filter(t => t.status === 'en_proceso').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar árboles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filter === 'plantado' ? 'default' : 'outline'}
            onClick={() => setFilter('plantado')}
            size="sm"
          >
            Plantados
          </Button>
          <Button
            variant={filter === 'en_proceso' ? 'default' : 'outline'}
            onClick={() => setFilter('en_proceso')}
            size="sm"
          >
            En Proceso
          </Button>
        </div>
      </div>

      {/* Trees Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando árboles...</p>
        </div>
      ) : filteredTrees.length === 0 ? (
        <Card className="p-12 text-center">
          <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron árboles
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filter !== 'all'
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'Comienza plantando tu primer árbol'}
          </p>
          {!searchQuery && filter === 'all' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Plantar Mi Primer Árbol
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrees.map((tree) => (
            <Card key={tree.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">{tree.name || 'Sin nombre'}</CardTitle>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tree.status === 'plantado'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tree.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Especie:</span> {tree.species || 'No especificada'}</p>
                  <p><span className="font-medium">Fecha:</span> {tree.created_at ? new Date(tree.created_at).toLocaleDateString() : 'N/A'}</p>
                  {tree.latitude && tree.longitude && (
                    <p><span className="font-medium">Ubicación:</span> {tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTreesContent;
