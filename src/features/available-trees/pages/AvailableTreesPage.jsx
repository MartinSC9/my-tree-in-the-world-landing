import React, { useState, useEffect } from 'react';
import { availableTreeService } from '../services';
import AvailableTreeCard from '@features/available-trees/components/AvailableTreeCard';
import { Input } from '@shared/components/ui/input';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import AuthenticatedLayout from '@shared/components/layout/AuthenticatedLayout';

const AvailableTreesPage = () => {
  const [trees, setTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);

  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    loadTrees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trees, searchTerm, selectedSpecies, priceRange, inStockOnly]);

  const loadTrees = async () => {
    try {
      setLoading(true);
      const data = await availableTreeService.getAvailableTrees({ in_stock: false });
      setTrees(data);

      // Extract unique species
      const species = [...new Set(data.map(t => t.species))].sort();
      setSpeciesList(species);

      setError(null);
    } catch (err) {
      console.error('Error loading trees:', err);
      setError('Error al cargar el catálogo de árboles');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trees];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        tree =>
          tree.name.toLowerCase().includes(term) ||
          tree.species.toLowerCase().includes(term) ||
          tree.scientific_name?.toLowerCase().includes(term) ||
          tree.description?.toLowerCase().includes(term)
      );
    }

    // Species filter
    if (selectedSpecies) {
      filtered = filtered.filter(tree => tree.species === selectedSpecies);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(tree => tree.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(tree => tree.price <= parseFloat(priceRange.max));
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(tree => tree.stock_quantity > 0);
    }

    setFilteredTrees(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecies('');
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedSpecies ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Catálogo de Árboles
            </h1>
            <p className="text-lg text-gray-600">
              Descubre y compra árboles nativos de viveros certificados
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  Limpiar filtros ({activeFiltersCount})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <Input
                  type="text"
                  placeholder="Nombre, especie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Species Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especie
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                >
                  <option value="">Todas las especies</option>
                  {speciesList.map((species) => (
                    <option key={species} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de precio (USD)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    min="0"
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilidad
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Solo en stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              {loading ? (
                'Cargando...'
              ) : (
                <>
                  Mostrando <strong>{filteredTrees.length}</strong> de{' '}
                  <strong>{trees.length}</strong> árboles
                </>
              )}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadTrees}
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm h-96 animate-pulse"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trees Grid */}
          {!loading && filteredTrees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrees.map((tree) => (
                <AvailableTreeCard key={tree.id} tree={tree} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredTrees.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron árboles
              </h3>
              <p className="text-gray-600 mb-4">
                {activeFiltersCount > 0
                  ? 'Intenta ajustar los filtros para ver más resultados'
                  : 'Aún no hay árboles disponibles en el catálogo'}
              </p>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AvailableTreesPage;
