import React, { useState, useEffect } from 'react';
import { Card } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import CollaborativeTreeCard from './CollaborativeTreeCard';
import ContributeModal from './ContributeModal';
import { getCollaborativeTrees } from '@features/collaborative-trees/services';
import { FaTree, FaSpinner, FaFilter } from 'react-icons/fa';

const CollaborativeTreesGallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('active');
  const [pagination, setPagination] = useState({
    limit: 12,
    offset: 0,
    hasMore: false
  });

  // Cargar proyectos colaborativos
  const loadProjects = async (reset = false) => {
    try {
      setLoading(true);
      const offset = reset ? 0 : pagination.offset;

      const response = await getCollaborativeTrees({
        status: filterStatus,
        limit: pagination.limit,
        offset,
        sort: 'created_at',
        order: 'DESC'
      });

      if (reset) {
        setProjects(response.collaborative_trees || []);
      } else {
        setProjects(prev => [...prev, ...(response.collaborative_trees || [])]);
      }

      setPagination({
        ...pagination,
        offset: reset ? pagination.limit : offset + pagination.limit,
        hasMore: response.pagination?.has_more || false
      });

      setError(null);
    } catch (err) {
      console.error('Error loading collaborative trees:', err);
      setError('Error al cargar proyectos colaborativos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(true);
  }, [filterStatus]);

  const handleContribute = (project) => {
    setSelectedProject(project);
    setShowContributeModal(true);
  };

  const handleContributionSuccess = () => {
    // Recargar proyectos después de contribuir
    loadProjects(true);
    setShowContributeModal(false);
    setSelectedProject(null);
  };

  const handleLoadMore = () => {
    loadProjects(false);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <FaSpinner className="text-5xl text-green-600 animate-spin" />
        <p className="text-gray-600">Cargando proyectos colaborativos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => loadProjects(true)} variant="outline">
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-800 flex items-center gap-2">
            <FaTree className="text-green-600" />
            Árboles Colaborativos
          </h2>
          <p className="text-gray-600 mt-2">
            Contribuye con otros usuarios para plantar árboles juntos
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="active">Activos</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Grid de proyectos */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FaTree className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay proyectos {filterStatus === 'active' ? 'activos' : filterStatus === 'completed' ? 'completados' : 'cancelados'}
          </h3>
          <p className="text-gray-500">
            {filterStatus === 'active'
              ? 'Sé el primero en crear un proyecto colaborativo'
              : 'Aún no hay proyectos en esta categoría'
            }
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <CollaborativeTreeCard
                key={project.id}
                project={project}
                onContribute={handleContribute}
                showActions={true}
              />
            ))}
          </div>

          {/* Botón cargar más */}
          {pagination.hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="px-8"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal de contribución */}
      {showContributeModal && selectedProject && (
        <ContributeModal
          project={selectedProject}
          isOpen={showContributeModal}
          onClose={() => {
            setShowContributeModal(false);
            setSelectedProject(null);
          }}
          onSuccess={handleContributionSuccess}
        />
      )}
    </div>
  );
};

export default CollaborativeTreesGallery;
