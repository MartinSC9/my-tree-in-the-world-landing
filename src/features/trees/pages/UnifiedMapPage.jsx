import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Globe, Users, User, Check, Clock } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import TreeMap from '@features/trees/components/TreeMap';
import { treeService } from '@features/trees/services';
import { useAuth } from '@core/contexts/AuthContext';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';

const UnifiedMapPage = () => {
  const { user, getRedirectPath } = useAuth();
  const [allMarkers, setAllMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomTreeId, setRandomTreeId] = useState(null);

  // Vista activa: 'all', 'my-trees', 'collaborative'
  const [activeView, setActiveView] = useState('all');

  // Filtro por stats card: 'all', 'planted', 'inProgress'
  const [statsFilter, setStatsFilter] = useState('all');

  const [filters, setFilters] = useState({
    name: '',
    status: 'all',
  });

  // Cargar todos los markers (regular + colaborativos) desde un solo endpoint
  const loadMarkers = async () => {
    setLoading(true);
    try {
      const markers = await treeService.getTreeMarkers();
      setAllMarkers(markers || []);

      // Seleccionar un árbol aleatorio para mostrar su popup abierto
      if (markers && markers.length > 0) {
        const randomIndex = Math.floor(Math.random() * markers.length);
        setRandomTreeId(markers[randomIndex].id);
      }
    } catch (error) {
      console.error('Error loading tree markers:', error);
      setAllMarkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  // Derivar datos de allMarkers
  const regularTrees = useMemo(() =>
    allMarkers.filter(t => t.type === 'regular'),
    [allMarkers]
  );

  const collaborativeTrees = useMemo(() =>
    allMarkers.filter(t => t.type === 'collaborative'),
    [allMarkers]
  );

  const myTrees = useMemo(() => {
    if (!user) return [];
    return allMarkers.filter(t => t.type === 'regular' && t.user_id === user.id);
  }, [allMarkers, user]);

  // Estadísticas globales
  const stats = useMemo(() => {
    const planted = regularTrees.filter(t => t.status === 'plantado' || t.status === 'verificado').length;
    const inProgress = regularTrees.filter(t => t.status === 'en_proceso').length;
    return {
      totalTrees: regularTrees.length,
      plantedTrees: planted,
      inProgressTrees: inProgress
    };
  }, [regularTrees]);

  // Combinar árboles según la vista activa
  const displayedTrees = useMemo(() => {
    if (activeView === 'all') {
      return allMarkers;
    } else if (activeView === 'my-trees') {
      return myTrees;
    } else if (activeView === 'collaborative') {
      return collaborativeTrees;
    }
    return [];
  }, [allMarkers, collaborativeTrees, myTrees, activeView]);

  // Filtrar árboles
  const filteredTrees = useMemo(() => {
    return displayedTrees.filter(tree => {
      const treeName = tree.name || tree.tree_name || '';
      if (filters.name && !treeName.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.status !== 'all' && tree.status !== filters.status) return false;

      // Filtro por stats card
      if (statsFilter === 'planted') {
        // Solo plantados (regulares con status plantado/verificado)
        return tree.type === 'regular' && (tree.status === 'plantado' || tree.status === 'verificado');
      } else if (statsFilter === 'inProgress') {
        // En progreso: regulares en_proceso + todos los colaborativos
        if (tree.type === 'collaborative') return true;
        return tree.type === 'regular' && tree.status === 'en_proceso';
      }

      return true;
    });
  }, [displayedTrees, filters.name, filters.status, statsFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Redirigir al front app para plantar
  const handlePlantClick = () => {
    if (user) {
      window.open(getRedirectPath(user.role), '_blank');
    } else {
      window.open(APP_URL + '/', '_blank');
    }
  };

  // Estadísticas globales simplificadas
  const viewStats = useMemo(() => {
    const totalAll = regularTrees.length + collaborativeTrees.length;
    // Solo contar como plantado los que realmente están plantados
    const planted = regularTrees.filter(t => t.status === 'plantado' || t.status === 'verificado').length;
    // En progreso: regulares en proceso + TODOS los colaborativos (active y completed)
    // porque "completed" solo significa financiado, no plantado
    const inProgress = regularTrees.filter(t => t.status === 'en_proceso').length + collaborativeTrees.length;

    return {
      total: totalAll,
      planted: planted,
      inProgress: inProgress
    };
  }, [regularTrees, collaborativeTrees]);

  const tabs = [
    { id: 'all', label: 'Todos los Árboles', icon: Globe, color: 'blue' },
    { id: 'my-trees', label: 'Mis Árboles', icon: User, color: 'green', requireAuth: true },
    { id: 'collaborative', label: 'Colaborativos', icon: Users, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              Mapa Global de Árboles
            </h1>
            <p className="text-base text-green-600">
              Explora y sigue árboles alrededor del mundo
            </p>
          </div>

          {/* Stats Cards - Clickeables para filtrar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
            <button
              onClick={() => setStatsFilter('all')}
              className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl px-6 py-4 shadow-lg transition-all hover:scale-105 ${statsFilter === 'all' ? 'ring-4 ring-blue-300' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-white" />
                  <div className="text-white text-left">
                    <div className="text-3xl font-bold">{viewStats.total}</div>
                    <div className="text-sm opacity-90">Total</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 border-white/60 flex items-center justify-center transition-all ${statsFilter === 'all' ? 'bg-white' : 'bg-transparent'}`}>
                  {statsFilter === 'all' && <Check className="h-4 w-4 text-blue-600" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setStatsFilter(statsFilter === 'planted' ? 'all' : 'planted')}
              className={`bg-gradient-to-br from-green-500 to-green-600 rounded-xl px-6 py-4 shadow-lg transition-all hover:scale-105 ${statsFilter === 'planted' ? 'ring-4 ring-green-300' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <TreePine className="h-8 w-8 text-white" />
                    <Check className="h-4 w-4 text-white absolute -bottom-1 -right-1 bg-green-600 rounded-full p-0.5" />
                  </div>
                  <div className="text-white text-left">
                    <div className="text-3xl font-bold">{viewStats.planted}</div>
                    <div className="text-sm opacity-90">Plantados</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 border-white/60 flex items-center justify-center transition-all ${statsFilter === 'planted' ? 'bg-white' : 'bg-transparent'}`}>
                  {statsFilter === 'planted' && <Check className="h-4 w-4 text-green-600" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setStatsFilter(statsFilter === 'inProgress' ? 'all' : 'inProgress')}
              className={`bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl px-6 py-4 shadow-lg transition-all hover:scale-105 ${statsFilter === 'inProgress' ? 'ring-4 ring-yellow-300' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <TreePine className="h-8 w-8 text-white" />
                    <Clock className="h-4 w-4 text-white absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5" />
                  </div>
                  <div className="text-white text-left">
                    <div className="text-3xl font-bold">{viewStats.inProgress}</div>
                    <div className="text-sm opacity-90">En Progreso</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 border-white/60 flex items-center justify-center transition-all ${statsFilter === 'inProgress' ? 'bg-white' : 'bg-transparent'}`}>
                  {statsFilter === 'inProgress' && <Check className="h-4 w-4 text-amber-600" />}
                </div>
              </div>
            </button>
          </div>

          {/* Map */}
          <Card className="shadow-xl border-green-200 relative overflow-visible">
            <CardContent className="p-0">
              <div className="relative">
                <TreeMap
                  trees={filteredTrees}
                  height="700px"
                  defaultOpenTreeId={randomTreeId}
                />

                {/* Leyenda de colores */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 z-[10]">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Leyenda</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>En Progreso</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Plantado</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                      <div className="flex items-center space-x-2">
                        <Users className="w-3 h-3 text-gray-600" />
                        <span>= Colaborativo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating Plant Button - Redirects to front app */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={handlePlantClick}
              className="bg-brand hover:bg-brand-dark text-white rounded-full px-6 py-4 shadow-2xl flex items-center justify-center gap-2"
              size="lg"
            >
              <TreePine className="h-5 w-5" />
              <span className="font-medium">Plantar Árbol</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UnifiedMapPage;
