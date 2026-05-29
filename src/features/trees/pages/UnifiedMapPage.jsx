import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TreePine,
  Globe,
  Users,
  User,
  Check,
  Clock,
  Moon,
  Sun,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import TreeMap from '@features/trees/components/TreeMap';
import { treeService } from '@features/trees/services';
import { useAuth } from '@core/contexts/AuthContext';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';
import { useTheme } from '@core/contexts/ThemeContext';

// Bounding box provincia de Córdoba, Argentina
const isInCordoba = (lat, lng) => lat >= -35.1 && lat <= -29.5 && lng >= -65.8 && lng <= -61.7;

// Redondear a ~1km para no asustar al usuario
const roundCoord = (val) => Math.round(val * 100) / 100;

// Haversine
const distanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const NEARBY_RADIUS_KM = 2;
const FEW_TREES_THRESHOLD = 5;

const UnifiedMapPage = () => {
  const { isDark } = useTheme();
  const { user, getRedirectPath } = useAuth();
  const { treeId: urlTreeId } = useParams();
  const navigate = useNavigate();
  const [allMarkers, setAllMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultTreeId, setDefaultTreeId] = useState(null);

  // Geolocation aproximada
  const [userLocation, setUserLocation] = useState(null);
  const [showNearbyBanner, setShowNearbyBanner] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = roundCoord(pos.coords.latitude);
        const lng = roundCoord(pos.coords.longitude);
        if (isInCordoba(lat, lng)) {
          setUserLocation({ lat, lng });
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  // Dark mode del mapa (independiente del tema global)
  const [darkMap, setDarkMap] = useState(isDark);

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
      window.open(APP_URL + '/plantar', '_blank');
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
          {(() => {
            const inactiveClass = darkMap
              ? 'bg-gray-800/90 text-gray-300 border-gray-600 hover:bg-gray-800'
              : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white';
            return (
              <>
                <button
                  onClick={() => setStatsFilter('all')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-all shadow-sm ${statsFilter === 'all' ? 'bg-blue-500 text-white border-blue-500' : inactiveClass}`}
                >
                  <TreePine className="h-3 w-3" />
                  <span className="font-bold">{viewStats.total}</span>
                  <span>Total</span>
                </button>

                <button
                  onClick={() => setStatsFilter(statsFilter === 'planted' ? 'all' : 'planted')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-all shadow-sm ${statsFilter === 'planted' ? 'bg-green-500 text-white border-green-500' : inactiveClass}`}
                >
                  <Check className="h-3 w-3" />
                  <span className="font-bold">{viewStats.planted}</span>
                  <span>Plantados</span>
                </button>

                <button
                  onClick={() =>
                    setStatsFilter(statsFilter === 'inProgress' ? 'all' : 'inProgress')
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-all shadow-sm ${statsFilter === 'inProgress' ? 'bg-amber-500 text-white border-amber-500' : inactiveClass}`}
                >
                  <Clock className="h-3 w-3" />
                  <span className="font-bold">{viewStats.inProgress}</span>
                  <span>En Progreso</span>
                </button>
              </>
            );
          })()}
        </div>

        <TreeMap
          trees={filteredTrees}
          height="100%"
          defaultOpenTreeId={defaultTreeId}
          onTreeSelect={handleTreeSelect}
          onTreeDeselect={handleTreeDeselect}
          forceDarkMap={darkMap}
          userLocation={userLocation}
          nearbyRadiusKm={NEARBY_RADIUS_KM}
        />

        {/* Leyenda + Dark mode toggle */}
        <div
          className={`absolute top-4 right-4 backdrop-blur-sm rounded-lg shadow-lg p-3 border z-[10] ${darkMap ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`text-xs font-semibold ${darkMap ? 'text-gray-300' : 'text-gray-700'}`}>
              Leyenda
            </div>
            <button
              onClick={() => setDarkMap(!darkMap)}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                darkMap
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={darkMap ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMap ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className={darkMap ? 'text-gray-400' : ''}>En Progreso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className={darkMap ? 'text-gray-400' : ''}>Plantado</span>
            </div>
            <div
              className={`border-t pt-1.5 mt-1.5 ${darkMap ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center space-x-2">
                <Users className={`w-3 h-3 ${darkMap ? 'text-gray-500' : 'text-gray-600'}`} />
                <span className={darkMap ? 'text-gray-400' : ''}>= Colaborativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner "pocos árboles en tu zona" — reemplaza el botón flotante */}
      {(() => {
        if (!userLocation || !showNearbyBanner) {
          // Sin banner → mostrar botón flotante normal
          return (
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
          );
        }
        const nearbyCount = allMarkers.filter(
          (t) =>
            t.latitude &&
            t.longitude &&
            distanceKm(
              userLocation.lat,
              userLocation.lng,
              Number(t.latitude),
              Number(t.longitude)
            ) <= NEARBY_RADIUS_KM
        ).length;
        if (nearbyCount > FEW_TREES_THRESHOLD) {
          // Muchos árboles → botón flotante normal
          return (
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
          );
        }
        const message =
          nearbyCount === 0
            ? 'No hay árboles cerca tuyo'
            : `Solo ${nearbyCount} ${nearbyCount === 1 ? 'árbol' : 'árboles'} cerca tuyo`;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%]"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl px-5 py-4 shadow-2xl border border-emerald-400/30 relative">
              <button
                onClick={() => setShowNearbyBanner(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{message}</p>
                  <p className="text-emerald-100 text-xs">Tu zona necesita más verde</p>
                </div>
              </div>
              <Button
                onClick={handlePlantClick}
                size="sm"
                className="mt-3 w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
              >
                <TreePine className="h-4 w-4 mr-1.5" />
                Plantar ahora
              </Button>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
};

export default UnifiedMapPage;
