import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TreePine, Plus, Users, MapPin, Calendar, Search, Filter,
  Eye, ChevronRight, Leaf, Globe, Award, TrendingUp,
  CheckCircle, Clock, Sprout, Heart, Gift
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { Progress } from '@shared/components/ui/progress';
import { useAuth } from '@core/contexts/AuthContext';
import { useTree } from '@core/contexts/TreeContext';
import { toast } from '@shared/components/ui/use-toast';
import TreeMap from '@features/trees/components/TreeMap';
import collaborativeTreeService from '@features/collaborative-trees/services';

const ArbolesUnifiedSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trees, loading: treesLoading } = useTree();
  const userId = user?.id;

  // Estados
  const [activeTab, setActiveTab] = useState('todos'); // 'todos', 'mis-arboles', 'colaborativos'
  const [searchTerm, setSearchTerm] = useState('');
  const [collaborativeData, setCollaborativeData] = useState({
    myProjects: [],
    myContributions: [],
    availableProjects: []
  });
  const [loadingCollaborative, setLoadingCollaborative] = useState(false);
  const [selectedTreeId, setSelectedTreeId] = useState(null);

  // Cargar datos colaborativos
  useEffect(() => {
    const loadCollaborativeData = async () => {
      if (!user) return;

      setLoadingCollaborative(true);
      try {
        const [projects, contributions, available] = await Promise.all([
          collaborativeTreeService.getMyProjects(),
          collaborativeTreeService.getMyContributions(),
          collaborativeTreeService.getCollaborativeTrees({ status: 'active', limit: 50 })
        ]);

        setCollaborativeData({
          myProjects: projects.my_projects || [],
          myContributions: contributions.my_contributions || [],
          availableProjects: available.projects || []
        });
      } catch (error) {
        console.error('Error cargando datos colaborativos:', error);
      } finally {
        setLoadingCollaborative(false);
      }
    };

    loadCollaborativeData();
  }, [user]);

  // Combinar árboles para el mapa
  const allTreesForMap = useMemo(() => {
    const individualTrees = (trees || []).map(tree => ({
      ...tree,
      type: 'individual'
    }));

    const collaborativeTrees = collaborativeData.availableProjects.map(project => ({
      id: `collab-${project.id}`,
      projectId: project.id,
      name: project.tree_name,
      species: project.tree_species,
      latitude: project.latitude,
      longitude: project.longitude,
      status: project.status,
      type: 'collaborative',
      funding_percentage: project.current_amount && project.target_amount
        ? (project.current_amount / project.target_amount) * 100
        : 0,
      creator_name: project.creator_info?.name || 'Anónimo',
      total_contributors: project.total_contributors || 0
    }));

    return [...individualTrees, ...collaborativeTrees];
  }, [trees, collaborativeData.availableProjects]);

  // Filtrar árboles según tab y búsqueda
  const filteredTrees = useMemo(() => {
    let filtered = trees || [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tree =>
        tree.name?.toLowerCase().includes(term) ||
        tree.species?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [trees, searchTerm]);

  const filteredCollaborative = useMemo(() => {
    let filtered = collaborativeData.availableProjects;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.tree_name?.toLowerCase().includes(term) ||
        project.tree_species?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [collaborativeData.availableProjects, searchTerm]);

  // Estadísticas
  const stats = useMemo(() => {
    const myTrees = trees?.length || 0;
    const plantedTrees = trees?.filter(t => t.status === 'plantado' || t.status === 'verificado').length || 0;
    const inProgress = trees?.filter(t => t.status === 'en_proceso').length || 0;
    const myCollaborations = collaborativeData.myContributions.length;
    const myProjects = collaborativeData.myProjects.length;

    return { myTrees, plantedTrees, inProgress, myCollaborations, myProjects };
  }, [trees, collaborativeData]);

  // Handler para click en proyecto colaborativo
  const handleProjectClick = (projectId) => {
    const actualId = projectId.toString().replace('collab-', '');
    navigate(`/arboles-colaborativos/${actualId}`);
  };

  // Renderizar tarjeta de árbol individual
  const renderTreeCard = (tree) => (
    <motion.div
      key={tree.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => navigate(`/usuario/${userId}/arboles/${tree.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            tree.status === 'plantado' ? 'bg-green-100' :
            tree.status === 'en_proceso' ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            <TreePine className={`h-5 w-5 ${
              tree.status === 'plantado' ? 'text-green-600' :
              tree.status === 'en_proceso' ? 'text-yellow-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tree.name || 'Sin nombre'}</h3>
            <p className="text-sm text-gray-500">{tree.species || 'Especie no especificada'}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          tree.status === 'plantado' ? 'bg-green-100 text-green-700' :
          tree.status === 'en_proceso' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {tree.status === 'plantado' ? 'Plantado' :
           tree.status === 'en_proceso' ? 'En proceso' : 'Pendiente'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {tree.latitude && tree.longitude && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{tree.city || tree.country || 'Ubicación registrada'}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(tree.created_at).toLocaleDateString('es-AR')}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <Button variant="ghost" size="sm" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50">
          Ver detalles <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );

  // Renderizar tarjeta de proyecto colaborativo
  const renderCollaborativeCard = (project) => {
    const progress = project.current_amount && project.target_amount
      ? (project.current_amount / project.target_amount) * 100
      : 0;
    const isContributor = collaborativeData.myContributions.some(c => c.project_id === project.id);
    const isCreator = collaborativeData.myProjects.some(p => p.id === project.id);

    return (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => navigate(`/arboles-colaborativos/${project.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{project.tree_name}</h3>
              <p className="text-sm text-gray-500">{project.tree_species}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isCreator && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Mi proyecto
              </span>
            )}
            {isContributor && !isCreator && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Contribuí
              </span>
            )}
            {project.status === 'completed' && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Completado
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Financiamiento</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.total_contributors || 0} contrib.</span>
          </div>
          {project.city && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{project.city}</span>
            </div>
          )}
        </div>

        {project.coupon_raffle_enabled && (
          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3">
            <Gift className="h-3 w-3" />
            <span>Sorteo de cupones</span>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            {project.status === 'completed' ? 'Ver detalles' : 'Contribuir'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Árboles</h1>
          <p className="text-gray-600">Gestiona tus árboles y participa en proyectos colaborativos</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/usuario/${userId}/plantararbol`)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Plantar Árbol
          </Button>
          <Button
            onClick={() => navigate('/arboles-colaborativos')}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Ver Colaborativos
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <TreePine className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.myTrees}</p>
                <p className="text-xs text-green-600">Mis árboles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{stats.plantedTrees}</p>
                <p className="text-xs text-emerald-600">Plantados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
                <p className="text-xs text-yellow-600">En proceso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{stats.myCollaborations}</p>
                <p className="text-xs text-purple-600">Contribuciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.myProjects}</p>
                <p className="text-xs text-blue-600">Mis proyectos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa unificado */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Mapa de Árboles
            </CardTitle>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Individuales
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                Colaborativos
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
            {(treesLoading || loadingCollaborative) ? (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-500">Cargando mapa...</p>
                </div>
              </div>
            ) : (
              <TreeMap
                trees={allTreesForMap}
                height="400px"
                onProjectClick={handleProjectClick}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs de contenido */}
      <div>
        {/* Tab buttons */}
        <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4">
          <Button
            variant={activeTab === 'todos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('todos')}
            className={activeTab === 'todos' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Todos
          </Button>
          <Button
            variant={activeTab === 'mis-arboles' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('mis-arboles')}
            className={activeTab === 'mis-arboles' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <TreePine className="h-4 w-4 mr-2" />
            Mis Árboles ({stats.myTrees})
          </Button>
          <Button
            variant={activeTab === 'colaborativos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('colaborativos')}
            className={activeTab === 'colaborativos' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <Users className="h-4 w-4 mr-2" />
            Colaborativos ({filteredCollaborative.length})
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o especie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'todos' && (
            <motion.div
              key="todos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mis árboles */}
              {filteredTrees.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-green-600" />
                    Mis Árboles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTrees.slice(0, 6).map(renderTreeCard)}
                  </div>
                  {filteredTrees.length > 6 && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => setActiveTab('mis-arboles')}
                    >
                      Ver todos mis árboles ({filteredTrees.length})
                    </Button>
                  )}
                </div>
              )}

              {/* Proyectos colaborativos */}
              {filteredCollaborative.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Proyectos Colaborativos Activos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCollaborative.slice(0, 6).map(renderCollaborativeCard)}
                  </div>
                  {filteredCollaborative.length > 6 && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => setActiveTab('colaborativos')}
                    >
                      Ver todos los proyectos ({filteredCollaborative.length})
                    </Button>
                  )}
                </div>
              )}

              {/* Estado vacío */}
              {filteredTrees.length === 0 && filteredCollaborative.length === 0 && (
                <div className="text-center py-12">
                  <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No se encontraron resultados' : 'Comienza tu viaje ecológico'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? 'Intenta con otros términos de búsqueda'
                      : 'Planta tu primer árbol o contribuye a un proyecto colaborativo'
                    }
                  </p>
                  {!searchTerm && (
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => navigate(`/usuario/${userId}/plantararbol`)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Plantar Árbol
                      </Button>
                      <Button
                        onClick={() => navigate('/arboles-colaborativos')}
                        variant="outline"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Ver Colaborativos
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'mis-arboles' && (
            <motion.div
              key="mis-arboles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredTrees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTrees.map(renderTreeCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'No se encontraron árboles' : 'Aún no has plantado ningún árbol'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => navigate(`/usuario/${userId}/plantararbol`)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Plantar tu primer árbol
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'colaborativos' && (
            <motion.div
              key="colaborativos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredCollaborative.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCollaborative.map(renderCollaborativeCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos colaborativos disponibles'}
                  </p>
                  <Button
                    onClick={() => navigate('/arboles-colaborativos')}
                    variant="outline"
                  >
                    Ver todos los proyectos
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArbolesUnifiedSection;
