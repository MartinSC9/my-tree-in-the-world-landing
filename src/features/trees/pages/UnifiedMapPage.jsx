import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, TreePine, Globe, Users, Plus, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Select } from '@shared/components/ui/select';
import { Card, CardContent } from '@shared/components/ui/card';
import TreeMap from '@features/trees/components/TreeMap';
import PlantTreeWizard from '@features/trees/components/PlantTreeWizard';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import collaborativeTreeService from '@features/collaborative-trees/services';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/ui/dialog';
import { toast } from '@shared/components/ui/use-toast';

const UnifiedMapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trees, stats, loadTrees } = useTree();
  const [collaborativeTrees, setCollaborativeTrees] = useState([]);
  const [myTrees, setMyTrees] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);

  // Vista activa: 'all', 'my-trees', 'collaborative'
  const [activeView, setActiveView] = useState('all');

  const [filters, setFilters] = useState({
    name: '',
    status: 'all',
  });

  useEffect(() => {
    loadTrees();
    loadCollaborativeTrees();
    if (user) {
      loadMyTrees();
    }
  }, [user]);

  const loadCollaborativeTrees = async () => {
    try {
      const data = await collaborativeTreeService.getCollaborativeTrees({
        status: 'active,completed'
      });
      setCollaborativeTrees(data.collaborative_trees || []);
    } catch (error) {
      console.error('Error loading collaborative trees:', error);
      setCollaborativeTrees([]);
    }
  };

  const loadMyTrees = async () => {
    if (!user) return;

    try {
      // Filter trees by current user
      const userTrees = trees.filter(tree => tree.user_id === user.id);
      setMyTrees(userTrees);
    } catch (error) {
      console.error('Error loading my trees:', error);
      setMyTrees([]);
    }
  };

  // Actualizar mis árboles cuando cambien los trees
  useEffect(() => {
    if (user && trees.length > 0) {
      const userTrees = trees.filter(tree => tree.user_id === user.id);
      setMyTrees(userTrees);
    }
  }, [trees, user]);

  // Combinar árboles según la vista activa
  const displayedTrees = useMemo(() => {
    let treesToDisplay = [];

    if (activeView === 'all') {
      // Mostrar todos: regulares + colaborativos
      const regular = trees.map(tree => ({ ...tree, type: 'regular' }));
      const collaborative = collaborativeTrees.map(tree => ({
        ...tree,
        type: 'collaborative',
        name: tree.tree_name,
        status: tree.status === 'completed' ? 'verificado' : 'en_proceso'
      }));
      treesToDisplay = [...regular, ...collaborative];
    } else if (activeView === 'my-trees') {
      // Mostrar solo mis árboles
      treesToDisplay = myTrees.map(tree => ({ ...tree, type: 'regular' }));
    } else if (activeView === 'collaborative') {
      // Mostrar solo colaborativos
      treesToDisplay = collaborativeTrees.map(tree => ({
        ...tree,
        type: 'collaborative',
        name: tree.tree_name,
        status: tree.status === 'completed' ? 'verificado' : 'en_proceso'
      }));
    }

    return treesToDisplay;
  }, [trees, collaborativeTrees, myTrees, activeView]);

  // Filtrar árboles
  const filteredTrees = useMemo(() => {
    return displayedTrees.filter(tree => {
      if (filters.name && !tree.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.status !== 'all' && tree.status !== filters.status) return false;
      return true;
    });
  }, [displayedTrees, filters.name, filters.status]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTreeClick = (tree) => {
    setSelectedTree(tree);
  };

  const handlePlantComplete = (newTree) => {
    setShowPlantModal(false);
    toast({
      title: "¡Árbol plantado!",
      description: "Tu árbol ha sido registrado exitosamente",
    });
    loadTrees();
    if (user) {
      loadMyTrees();
    }
  };

  // Estadísticas según vista activa
  const viewStats = useMemo(() => {
    if (activeView === 'all') {
      return {
        total: trees.length,
        collaborative: collaborativeTrees.length,
        planted: stats.plantedTrees,
        inProgress: stats.inProgressTrees
      };
    } else if (activeView === 'my-trees') {
      const planted = myTrees.filter(t => t.status === 'plantado' || t.status === 'verificado').length;
      const inProgress = myTrees.filter(t => t.status === 'en_proceso').length;
      return {
        total: myTrees.length,
        collaborative: 0,
        planted,
        inProgress
      };
    } else {
      const completed = collaborativeTrees.filter(t => t.status === 'completed').length;
      const active = collaborativeTrees.filter(t => t.status === 'active').length;
      return {
        total: collaborativeTrees.length,
        collaborative: collaborativeTrees.length,
        planted: completed,
        inProgress: active
      };
    }
  }, [activeView, trees, collaborativeTrees, myTrees, stats]);

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
              Explora, planta y sigue árboles alrededor del mundo
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {tabs.map((tab) => {
              if (tab.requireAuth && !user) return null;

              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              const colorClasses = {
                blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
                green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
                purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'
              };

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-md ${colorClasses[tab.color]}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <TreePine className="h-8 w-8 text-white" />
                <div className="text-white">
                  <div className="text-3xl font-bold">{viewStats.total}</div>
                  <div className="text-sm opacity-90">
                    {activeView === 'my-trees' ? 'Mis Árboles' : activeView === 'collaborative' ? 'Proyectos' : 'Árboles Totales'}
                  </div>
                </div>
              </div>
            </div>

            {activeView === 'all' && (
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-white" />
                  <div className="text-white">
                    <div className="text-3xl font-bold">{viewStats.collaborative}</div>
                    <div className="text-sm opacity-90">Proyectos Colaborativos</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full"></div>
                <div className="text-white">
                  <div className="text-3xl font-bold">{viewStats.planted}</div>
                  <div className="text-sm opacity-90">
                    {activeView === 'collaborative' ? 'Completados' : 'Plantados'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/80 rounded-full"></div>
                <div className="text-white">
                  <div className="text-3xl font-bold">{viewStats.inProgress}</div>
                  <div className="text-sm opacity-90">
                    {activeView === 'collaborative' ? 'Activos' : 'En Progreso'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            <div className="text-sm text-gray-600">
              Mostrando {filteredTrees.length} de {displayedTrees.length} árboles
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4 shadow-lg border-green-200">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Buscar por nombre
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            placeholder="Nombre del árbol..."
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="pl-10 border-green-300 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Estado
                        </label>
                        <Select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="border-green-300 focus:border-green-500"
                        >
                          <option value="all">Todos</option>
                          <option value="sin_plantar">Sin Plantar</option>
                          <option value="en_proceso">En Proceso</option>
                          <option value="plantado">Plantado</option>
                          <option value="verificado">Verificado</option>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          onClick={() => setFilters({ name: '', status: 'all' })}
                          variant="outline"
                          className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map */}
          <Card className="shadow-xl border-green-200 relative overflow-visible">
            <CardContent className="p-0">
              <div className="relative">
                <TreeMap
                  trees={filteredTrees}
                  height="700px"
                  onProjectClick={handleTreeClick}
                />

                {/* Leyenda de colores */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 z-[1000]">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Leyenda</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Sin Plantar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>En Proceso</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Plantado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3 text-purple-500" />
                      <span>Colaborativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating Plant Button */}
          {user && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="fixed bottom-8 right-8 z-50"
            >
              <Button
                onClick={() => setShowPlantModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16 shadow-2xl flex items-center justify-center group"
                size="lg"
              >
                <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
              <div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Plantar Árbol
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Plant Tree Modal */}
      <Dialog open={showPlantModal} onOpenChange={setShowPlantModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                <TreePine className="h-6 w-6" />
                Plantar Nuevo Árbol
              </DialogTitle>
              <button
                onClick={() => setShowPlantModal(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>
          <PlantTreeWizard onComplete={handlePlantComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedMapPage;
