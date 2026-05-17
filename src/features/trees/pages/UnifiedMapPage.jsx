import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Globe, Users, User, Check, Clock } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import TreeMap from '@features/trees/components/TreeMap';
import { treeService } from '@features/trees/services';
import { useAuth } from '@core/contexts/AuthContext';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';
import { useTheme } from '@core/contexts/ThemeContext';

const UnifiedMapPage = () => {
  const { isDark } = useTheme();
  const { user, getRedirectPath } = useAuth();
  const { treeId: urlTreeId } = useParams();
  const navigate = useNavigate();
  const [allMarkers, setAllMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultTreeId, setDefaultTreeId] = useState(null);

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

      // Seleccionar árbol por defecto: el de la URL o uno aleatorio
      if (markers && markers.length > 0) {
        if (urlTreeId) {
          const parsedId = parseInt(urlTreeId, 10);
          const exists = markers.some((m) => m.id === parsedId);
          if (exists) {
            setDefaultTreeId(parsedId);
          }
          // Si no existe, no abrir ningún popup
        } else {
          const randomIndex = Math.floor(Math.random() * markers.length);
          setDefaultTreeId(markers[randomIndex].id);
        }
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
  const regularTrees = useMemo(() => allMarkers.filter((t) => t.type === 'regular'), [allMarkers]);

  const collaborativeTrees = useMemo(
    () => allMarkers.filter((t) => t.type === 'collaborative'),
    [allMarkers]
  );

  const myTrees = useMemo(() => {
    if (!user) return [];
    return allMarkers.filter((t) => t.type === 'regular' && t.user_id === user.id);
  }, [allMarkers, user]);

  // Estadísticas globales
  const stats = useMemo(() => {
    const planted = regularTrees.filter(
      (t) => t.status === 'plantado' || t.status === 'verificado'
    ).length;
    const inProgress = regularTrees.filter((t) => t.status === 'en_proceso').length;
    return {
      totalTrees: regularTrees.length,
      plantedTrees: planted,
      inProgressTrees: inProgress,
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
    return displayedTrees.filter((tree) => {
      const treeName = tree.name || tree.tree_name || '';
      if (filters.name && !treeName.toLowerCase().includes(filters.name.toLowerCase()))
        return false;
      if (filters.status !== 'all' && tree.status !== filters.status) return false;

      // Filtro por stats card
      if (statsFilter === 'planted') {
        // Solo plantados (regulares con status plantado/verificado)
        return (
          tree.type === 'regular' && (tree.status === 'plantado' || tree.status === 'verificado')
        );
      } else if (statsFilter === 'inProgress') {
        // En progreso: regulares en_proceso + todos los colaborativos
        if (tree.type === 'collaborative') return true;
        return tree.type === 'regular' && tree.status === 'en_proceso';
      }

      return true;
    });
  }, [displayedTrees, filters.name, filters.status, statsFilter]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleTreeSelect = useCallback(
    (id) => {
      navigate(`/mapa/${id}`, { replace: true });
    },
    [navigate]
  );

  const handleTreeDeselect = useCallback(() => {
    // Solo actualizar la URL si seguimos en /mapa (evita interferir con navegación a otra página)
    if (window.location.pathname.startsWith('/mapa')) {
      navigate('/mapa', { replace: true });
    }
  }, [navigate]);

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
    const planted = regularTrees.filter(
      (t) => t.status === 'plantado' || t.status === 'verificado'
    ).length;
    // En progreso: regulares en proceso + TODOS los colaborativos (active y completed)
    // porque "completed" solo significa financiado, no plantado
    const inProgress =
      regularTrees.filter((t) => t.status === 'en_proceso').length + collaborativeTrees.length;

    return {
      total: totalAll,
      planted: planted,
      inProgress: inProgress,
    };
  }, [regularTrees, collaborativeTrees]);

  const tabs = [
    { id: 'all', label: 'Todos los Árboles', icon: Globe, color: 'blue' },
    { id: 'my-trees', label: 'Mis Árboles', icon: User, color: 'green', requireAuth: true },
    { id: 'collaborative', label: 'Colaborativos', icon: Users, color: 'purple' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative overflow-hidden">
      <div className="relative h-full w-full">
        {/* Stats filters - inside map */}
        <div className="absolute top-4 left-12 z-[10] flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatsFilter('all')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-all shadow-sm ${statsFilter === 'all' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800'}`}
          >
            <TreePine className="h-3 w-3" />
            <span className="font-bold">{viewStats.total}</span>
            <span>Total</span>
          </button>

          <button
            onClick={() => setStatsFilter(statsFilter === 'planted' ? 'all' : 'planted')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-all shadow-sm ${statsFilter === 'planted' ? 'bg-green-500 text-white border-green-500' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800'}`}
          >
            <Check className="h-3 w-3" />
            <span className="font-bold">{viewStats.planted}</span>
            <span>Plantados</span>
          </button>

          <button
            onClick={() => setStatsFilter(statsFilter === 'inProgress' ? 'all' : 'inProgress')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-all shadow-sm ${statsFilter === 'inProgress' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800'}`}
          >
            <Clock className="h-3 w-3" />
            <span className="font-bold">{viewStats.inProgress}</span>
            <span>En Progreso</span>
          </button>
        </div>

        <TreeMap
          trees={filteredTrees}
          height="100%"
          defaultOpenTreeId={defaultTreeId}
          onTreeSelect={handleTreeSelect}
          onTreeDeselect={handleTreeDeselect}
        />

        {/* Leyenda de colores */}
        <div
          className={`absolute top-4 right-4 backdrop-blur-sm rounded-lg shadow-lg p-3 border z-[10] ${isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}
        >
          <div
            className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Leyenda
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : ''}>En Progreso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : ''}>Plantado</span>
            </div>
            <div
              className={`border-t pt-1.5 mt-1.5 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center space-x-2">
                <Users className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`} />
                <span className={isDark ? 'text-gray-400' : ''}>= Colaborativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Plant Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={handlePlantClick}
          className="bg-brand hover:bg-brand-dark text-white rounded-full px-5 py-3 shadow-2xl flex items-center justify-center gap-2"
          size="lg"
        >
          <TreePine className="h-5 w-5" />
          <span className="font-medium">Plantar Árbol</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default UnifiedMapPage;
