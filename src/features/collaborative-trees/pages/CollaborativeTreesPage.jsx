import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TreePine, Plus, Filter, Info, Map, ArrowLeft,
  Users, Target, Sparkles, TrendingUp, Leaf
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import CollaborativeTreeCard from '@features/collaborative-trees/components/CollaborativeTreeCard';
import { getCollaborativeTrees, canCreateCollaborativeTree } from '@features/collaborative-trees/services';
import { useAuth } from '@core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@shared/components/layout/Navbar';
import UserSidebar from '@modules/user/components/UserSidebar';
import TreeMap from '@features/trees/components/TreeMap';
import ProjectDetailModal from '@features/collaborative-trees/components/ProjectDetailModal';

const CollaborativeTreesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [canCreate, setCanCreate] = useState(null);
  const [createPermissions, setCreatePermissions] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    has_more: false
  });

  useEffect(() => {
    if (user) {
      checkCreatePermissions();
    }
  }, [user]);

  const checkCreatePermissions = async () => {
    try {
      const permissions = await canCreateCollaborativeTree();
      setCanCreate(permissions.can_create);
      setCreatePermissions(permissions);
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      setCanCreate(false);
    }
  };

  const loadProjects = async (status = 'active', creatorType = 'all', offset = 0) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCollaborativeTrees({
        status,
        creator_type: creatorType,
        limit: pagination.limit,
        offset,
        sort: 'created_at',
        order: 'DESC'
      });

      setProjects(data.collaborative_trees || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      setError('Error al cargar los proyectos colaborativos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(filter, creatorFilter, 0);
  }, [filter, creatorFilter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handleLoadMore = () => {
    const newOffset = pagination.offset + pagination.limit;
    loadProjects(filter, newOffset);
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const handleCreateProject = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!canCreate) {
      alert(createPermissions?.reason || 'No puedes crear un proyecto en este momento.');
      return;
    }

    navigate('/arboles-colaborativos/crear');
  };

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalFunding = projects.reduce((sum, p) => sum + (parseFloat(p.current_amount) || 0), 0);
    const totalContributors = projects.reduce((sum, p) => sum + (p.total_contributors || 0), 0);
    const completedCount = projects.filter(p => p.status === 'completed').length;
    return { totalFunding, totalContributors, completedCount };
  }, [projects]);

  // Transformar proyectos al formato que espera TreeMap
  const mapTrees = projects.map(project => ({
    id: project.id,
    name: project.title || project.name,
    latitude: project.latitude,
    longitude: project.longitude,
    status: project.status === 'active' ? 'en_proceso' :
            project.status === 'completed' ? 'plantado' : 'sin_plantar',
    type: 'collaborative',
    tree_species: project.tree_species,
    funding_percentage: project.funding_percentage ||
      (project.current_amount && project.goal_amount ?
        Math.round((project.current_amount / project.goal_amount) * 100) : 0),
    creator_name: project.creator_name,
    message: project.description,
    city: project.location_name || 'Córdoba'
  }));

  const handleProjectClick = (tree) => {
    const project = projects.find(p => p.id === tree.id);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handleContributionSuccess = () => {
    setSelectedProject(null);
    loadProjects(filter, creatorFilter, 0);
  };

  const filterButtons = [
    { id: 'active', label: 'Activos', color: 'emerald' },
    { id: 'completed', label: 'Completados', color: 'blue' }
  ];

  const creatorButtons = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'user', label: 'Personas', icon: Users },
    { id: 'company', label: 'Empresas', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {user && (
          <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-64px)]">
            <UserSidebar />
          </div>
        )}

        <div className={user ? "flex-1" : "w-full"}>
          {/* Header compacto */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TreePine className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">Árboles Colaborativos</h1>
                      <p className="text-white/70 text-xs">Proyectos de reforestación compartidos</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!loading && projects.length > 0 && (
                    <div className="hidden sm:flex items-center gap-4 mr-4 text-sm">
                      <div className="text-center">
                        <span className="font-bold">{pagination.total}</span>
                        <span className="text-white/70 ml-1">proyectos</span>
                      </div>
                      <div className="w-px h-4 bg-white/30" />
                      <div className="text-center">
                        <span className="font-bold">{stats.totalContributors}</span>
                        <span className="text-white/70 ml-1">contribuyentes</span>
                      </div>
                    </div>
                  )}
                  {user && canCreate === true && (
                    <Button
                      onClick={handleCreateProject}
                      size="sm"
                      className="bg-white text-emerald-700 hover:bg-white/90 font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Crear
                    </Button>
                  )}
                  {user && canCreate === false && createPermissions && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-lg text-xs">
                      <Info className="w-3.5 h-3.5" />
                      <span>Ya tienes un proyecto</span>
                    </div>
                  )}
                  {!user && (
                    <Button
                      onClick={() => navigate('/login')}
                      size="sm"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Iniciar sesión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Status Filter */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Estado:</span>
                      </div>
                      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                        {filterButtons.map(btn => (
                          <button
                            key={btn.id}
                            onClick={() => handleFilterChange(btn.id)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                              filter === btn.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-gray-200" />

                    {/* Creator Filter */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">Tipo:</span>
                      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                        {creatorButtons.map(btn => {
                          const Icon = btn.icon;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => setCreatorFilter(btn.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                creatorFilter === btn.id
                                  ? 'bg-white text-gray-900 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mapa de Proyectos */}
            {!loading && !error && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mb-6"
              >
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                          <Map className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h2 className="font-semibold text-gray-900">Mapa de Proyectos</h2>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          {projects.length} ubicaciones
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Haz clic en un marcador para ver detalles
                      </span>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <TreeMap
                      trees={mapTrees}
                      height="100%"
                      onProjectClick={handleProjectClick}
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                  <Leaf className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-gray-500 text-sm">Cargando proyectos...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-600 font-medium mb-3">{error}</p>
                  <Button
                    onClick={() => loadProjects(filter, 0)}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-100"
                  >
                    Reintentar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-dashed border-2 border-gray-200">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TreePine className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {filter === 'active' ? 'No hay proyectos activos' : 'No hay proyectos completados'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                      {filter === 'active'
                        ? 'Sé el primero en crear un proyecto colaborativo y comenzar a hacer la diferencia.'
                        : 'Aún no se han completado proyectos colaborativos.'}
                    </p>
                    {user && filter === 'active' && canCreate && (
                      <Button
                        onClick={handleCreateProject}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Proyecto
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Projects Grid */}
            {!loading && !error && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">
                    {filter === 'active' ? 'Proyectos Activos' : 'Proyectos Completados'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {projects.length} de {pagination.total}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CollaborativeTreeCard project={project} />
                    </motion.div>
                  ))}
                </div>

                {pagination.has_more && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Cargar más proyectos
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalle del proyecto */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseModal}
          onContributionSuccess={handleContributionSuccess}
        />
      )}
    </div>
  );
};

export default CollaborativeTreesPage;
