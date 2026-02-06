import React, { useRef, useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Rectangle,
  Polygon,
} from 'react-leaflet';
import L from 'leaflet';
import { TreePine, Loader2 } from 'lucide-react';
import { treeService } from '../services';
import { getGreenSpaces, isPointInGreenSpace } from '../../../services/greenSpacesService';
import { useTheme } from '../../../core/contexts/ThemeContext';

// Límites geográficos de Córdoba Capital, Argentina
const CORDOBA_BOUNDS = {
  north: -31.33,
  south: -31.5,
  west: -64.25,
  east: -64.1,
};

// Función para verificar si una coordenada está dentro de Córdoba Capital
const isWithinCordoba = (lat, lng) => {
  return (
    lat <= CORDOBA_BOUNDS.north &&
    lat >= CORDOBA_BOUNDS.south &&
    lng >= CORDOBA_BOUNDS.west &&
    lng <= CORDOBA_BOUNDS.east
  );
};

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Cache de iconos para evitar recrearlos en cada render
const iconCache = {};

// Custom tree icon (color basado en estado y tipo)
const createTreeIcon = (status, type = 'regular') => {
  const cacheKey = `${status}-${type}`;

  // Retornar del cache si ya existe
  if (iconCache[cacheKey]) {
    return iconCache[cacheKey];
  }

  // Definir colores según estado del árbol
  const statusColors = {
    en_proceso: 'bg-yellow-500',
    active: 'bg-yellow-500',
    completed: 'bg-yellow-500', // Financiado pero no plantado aún
    plantado: 'bg-green-600',
    verificado: 'bg-green-800',
    cancelado: 'bg-gray-500',
  };

  // Color basado en estado para todos (incluido colaborativos)
  const color = statusColors[status] || 'bg-yellow-500';

  // Icono de árbol para todos los marcadores
  const iconSvg =
    type === 'collaborative' || type === 'myProject'
      ? `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
         <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
       </svg>`
      : `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
         <path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208H104L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320H80L5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5H192v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448H424.5c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320h33.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208h24.9c12.8 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"/>
       </svg>`;

  // Añadir borde diferente según tipo
  const borderClass =
    type === 'myProject'
      ? 'ring-4 ring-yellow-400 shadow-2xl' // Mi proyecto: borde amarillo resaltado
      : type === 'collaborative'
        ? 'ring-2 ring-purple-400' // Otros proyectos colaborativos
        : '';

  const icon = L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full ${color} ${borderClass} text-white shadow-lg">
             ${iconSvg}
           </div>`,
    className: 'custom-tree-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Guardar en cache
  iconCache[cacheKey] = icon;
  return icon;
};

// Mapeo de estados a texto legible (mover fuera del render)
const statusLabels = {
  en_proceso: 'En Progreso',
  plantado: 'Plantado',
  verificado: 'Verificado',
  cancelado: 'Cancelado',
};

// Componente para manejar eventos de clic en el mapa
const MapEvents = ({
  onMapClick,
  restrictToCordoba = false,
  restrictToGreenSpaces = false,
  greenSpaces = [],
  onOutOfBounds,
  onNotInGreenSpace,
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      // Si está habilitada la restricción a Córdoba, validar
      if (restrictToCordoba) {
        if (!isWithinCordoba(lat, lng)) {
          // Notificar que el click está fuera de límites
          if (onOutOfBounds) {
            onOutOfBounds();
          }
          return; // No ejecutar onMapClick
        }
      }

      // Si está habilitada la restricción a espacios verdes, validar
      if (restrictToGreenSpaces && greenSpaces.length > 0) {
        const result = isPointInGreenSpace(lat, lng, greenSpaces);
        if (!result.isInside) {
          // Notificar que el click no está en un espacio verde
          if (onNotInGreenSpace) {
            onNotInGreenSpace();
          }
          return; // No ejecutar onMapClick
        }
      }

      if (onMapClick) {
        onMapClick(lat, lng);
      }
    },
  });
  return null;
};

const TreeMap = ({
  trees,
  height = '400px',
  showFilters = false,
  onMapClick,
  center: centerProp,
  zoom: zoomProp,
  selectedLocation,
  restrictToCordoba = false,
  restrictToGreenSpaces = false,
  showGreenSpaces = false,
  onOutOfBounds,
  onProjectClick,
  onNotInGreenSpace,
  defaultOpenTreeId = null,
}) => {
  const { isDark } = useTheme();
  const mapRef = useRef();
  const markerRefs = useRef({});
  const [loadedDetails, setLoadedDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [greenSpaces, setGreenSpaces] = useState([]);
  const [loadingGreenSpaces, setLoadingGreenSpaces] = useState(false);
  const [errorGreenSpaces, setErrorGreenSpaces] = useState(false);
  const [defaultPopupOpened, setDefaultPopupOpened] = useState(false);

  // Función para cargar detalles de un árbol (regular o colaborativo)
  const loadTreeDetails = async (treeId, treeType = 'regular') => {
    if (loadedDetails[treeId] || loadingDetails[treeId]) return;

    setLoadingDetails((prev) => ({ ...prev, [treeId]: true }));
    try {
      let details;
      if (treeType === 'collaborative') {
        details = await treeService.getCollaborativeTreeById(treeId);
      } else {
        details = await treeService.getTreeById(treeId);
      }
      setLoadedDetails((prev) => ({ ...prev, [treeId]: details }));
    } catch (error) {
      console.error('Error loading tree details:', error);
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [treeId]: false }));
    }
  };

  // Centro: usar el prop si está disponible, sino Córdoba Capital, Argentina
  const center = centerProp || [-31.4201, -64.1888];

  // Zoom: usar el prop si está disponible, sino 12
  const zoom = zoomProp || 12;

  // Cargar espacios verdes cuando se habilita la visualización o restricción
  useEffect(() => {
    if (showGreenSpaces || restrictToGreenSpaces) {
      setLoadingGreenSpaces(true);
      setErrorGreenSpaces(false);
      getGreenSpaces()
        .then((spaces) => {
          setGreenSpaces(spaces);
          setLoadingGreenSpaces(false);
          // Si no hay espacios verdes, marcar como error
          if (!spaces || spaces.length === 0) {
            setErrorGreenSpaces(true);
          }
        })
        .catch((err) => {
          console.error('Error loading green spaces:', err);
          setLoadingGreenSpaces(false);
          setErrorGreenSpaces(true);
        });
    }
  }, [showGreenSpaces, restrictToGreenSpaces]);

  // Abrir popup por defecto cuando se especifica defaultOpenTreeId
  useEffect(() => {
    if (defaultOpenTreeId && !defaultPopupOpened && trees && trees.length > 0) {
      // Pequeño delay para asegurar que el mapa y marcadores estén renderizados
      const timer = setTimeout(() => {
        const markerRef = markerRefs.current[defaultOpenTreeId];
        if (markerRef) {
          markerRef.openPopup();
          setDefaultPopupOpened(true);
          // Cargar detalles del árbol
          const tree = trees.find((t) => t.id === defaultOpenTreeId);
          if (tree) {
            loadTreeDetails(tree.id, tree.type);
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [defaultOpenTreeId, defaultPopupOpened, trees]);

  // Determinar si hay una ubicación seleccionada para mostrar marcador
  const showSelectionMarker = selectedLocation && selectedLocation[0] && selectedLocation[1];

  // Calcular bounds dinámicamente basado en espacios verdes o usar límites fijos de Córdoba
  const calculatedBounds = React.useMemo(() => {
    if (restrictToGreenSpaces && greenSpaces.length > 0) {
      // Calcular límites basados en todas las coordenadas de los espacios verdes
      let minLat = Infinity,
        maxLat = -Infinity;
      let minLng = Infinity,
        maxLng = -Infinity;

      greenSpaces.forEach((space) => {
        space.coordinates.forEach((coord) => {
          minLat = Math.min(minLat, coord.lat);
          maxLat = Math.max(maxLat, coord.lat);
          minLng = Math.min(minLng, coord.lng);
          maxLng = Math.max(maxLng, coord.lng);
        });
      });

      return {
        south: minLat,
        north: maxLat,
        west: minLng,
        east: maxLng,
      };
    }

    // Usar límites fijos de Córdoba
    return CORDOBA_BOUNDS;
  }, [restrictToGreenSpaces, greenSpaces]);

  // Configurar bounds de Córdoba para limitar el mapa
  const cordobaBounds =
    restrictToCordoba || restrictToGreenSpaces
      ? [
          [calculatedBounds.south, calculatedBounds.west], // esquina suroeste
          [calculatedBounds.north, calculatedBounds.east], // esquina noreste
        ]
      : undefined;

  return (
    <div
      style={{ height, position: 'relative', width: '100%' }}
      className="rounded-lg overflow-hidden"
    >
      {/* Mensaje informativo cuando está restringido */}
      {restrictToGreenSpaces ? (
        <div
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 z-10 ${errorGreenSpaces ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium max-w-md text-center`}
        >
          {loadingGreenSpaces ? (
            <>🔄 Cargando espacios verdes...</>
          ) : errorGreenSpaces ? (
            <>
              ❌ No se pudieron cargar los espacios verdes. Por favor, recarga la página o inténtalo
              más tarde.
            </>
          ) : (
            <>🌳 Solo puedes plantar árboles en espacios verdes</>
          )}
        </div>
      ) : restrictToCordoba ? (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          ⚠️ Solo puedes plantar árboles dentro de Córdoba Capital
        </div>
      ) : null}

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
        ref={mapRef}
        maxBounds={cordobaBounds}
        maxBoundsViscosity={1.0}
        minZoom={restrictToCordoba ? 11 : undefined}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className={isDark ? 'map-tiles-dark' : ''}
        />

        {/* Rectángulo visual mostrando los límites de Córdoba */}
        {restrictToCordoba && !restrictToGreenSpaces && (
          <Rectangle
            bounds={cordobaBounds}
            pathOptions={{
              color: '#f97316',
              weight: 3,
              opacity: 0.8,
              fillOpacity: 0.05,
              dashArray: '10, 10',
            }}
          />
        )}

        {/* Polígonos de espacios verdes */}
        {showGreenSpaces &&
          greenSpaces.length > 0 &&
          greenSpaces.map((space, index) => {
            // Calcular el centro del polígono para usar como coordenadas al hacer clic
            const centerLat =
              space.coordinates.reduce((sum, coord) => sum + coord.lat, 0) /
              space.coordinates.length;
            const centerLng =
              space.coordinates.reduce((sum, coord) => sum + coord.lng, 0) /
              space.coordinates.length;

            return (
              <Polygon
                key={`green-space-${space.id || index}`}
                positions={space.coordinates.map((coord) => [coord.lat, coord.lng])}
                pathOptions={{
                  color: '#15803d',
                  weight: 3,
                  opacity: 1,
                  fillColor: '#4ade80',
                  fillOpacity: 0.35,
                }}
                eventHandlers={{
                  click: (e) => {
                    // Usar las coordenadas del clic exacto
                    if (onMapClick) {
                      onMapClick(e.latlng.lat, e.latlng.lng);
                    }
                  },
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-green-800">🌳 {space.name}</h3>
                    <p className="text-xs text-gray-600">Aquí plantarás tu árbol</p>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Agregar manejo de clics si se proporciona onMapClick */}
        {onMapClick && (
          <MapEvents
            onMapClick={onMapClick}
            restrictToCordoba={restrictToCordoba}
            restrictToGreenSpaces={restrictToGreenSpaces}
            greenSpaces={greenSpaces}
            onOutOfBounds={onOutOfBounds}
            onNotInGreenSpace={onNotInGreenSpace}
          />
        )}

        {/* Marcador de ubicación seleccionada con ícono de árbol */}
        {showSelectionMarker && (
          <Marker
            position={selectedLocation}
            icon={L.divIcon({
              html: `<div class="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-700 text-white shadow-2xl ring-4 ring-green-400 ring-offset-2 animate-pulse">
                       <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 448 512">
                         <path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208H104L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320H80L5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5H192v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448H424.5c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320h33.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208h24.9c12.8 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"/>
                       </svg>
                     </div>`,
              className: 'custom-selected-tree-marker',
              iconSize: [64, 64],
              iconAnchor: [32, 64],
            })}
          >
            <Popup autoClose={false} closeOnClick={false}>
              <div className="p-3">
                <p className="text-base font-bold text-green-700 flex items-center gap-2">
                  🌳 Aquí plantarás tu árbol
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {trees &&
          trees.length > 0 &&
          trees.map((tree) => {
            // Verificar que el árbol tenga coordenadas válidas
            if (!tree.latitude || !tree.longitude) return null;

            // Convertir coordenadas a números
            const lat = parseFloat(tree.latitude);
            const lng = parseFloat(tree.longitude);

            // Verificar que las coordenadas sean válidas después de la conversión
            if (isNaN(lat) || isNaN(lng)) return null;

            // Determinar el tipo de marcador
            const markerType = tree.isMyProject ? 'myProject' : tree.type || 'regular';

            // Z-index mayor para árboles plantados (aparecen encima)
            const zIndex = tree.status === 'plantado' || tree.status === 'verificado' ? 1000 : 100;

            return (
              <Marker
                key={`${markerType}-${tree.id}`}
                position={[lat, lng]}
                icon={createTreeIcon(tree.status, markerType)}
                zIndexOffset={zIndex}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current[tree.id] = ref;
                  }
                }}
                eventHandlers={{
                  popupopen: () => loadTreeDetails(tree.id, tree.type),
                }}
              >
                <Popup>
                  <TreePopupContent
                    tree={tree}
                    loadedDetails={loadedDetails}
                    loadingDetails={loadingDetails}
                    statusLabels={statusLabels}
                  />
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

// Componente para el contenido del popup con carga bajo demanda
const TreePopupContent = ({ tree, loadedDetails, loadingDetails, statusLabels }) => {
  // Usar detalles cargados si existen, sino usar datos del tree
  const details = loadedDetails[tree.id] || tree;
  const isLoading = loadingDetails[tree.id];

  // Si está cargando y no hay datos completos
  if (isLoading && !details.name) {
    return (
      <div className="p-2 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
        <span className="text-sm text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-green-800">{details.name || 'Árbol'}</h3>
        {tree.type === 'collaborative' && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            Colaborativo
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {details.country || details.city || 'Ubicación desconocida'}
      </p>
      {tree.type === 'collaborative' ? (
        <>
          <p className="text-xs text-gray-500 mt-1">
            Especie: {details.tree_species || 'No especificada'}
          </p>
          {details.funding_percentage !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Financiamiento:</span>
                <span className="font-semibold text-purple-600">{details.funding_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(details.funding_percentage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          {details.creator_name && (
            <p className="text-xs text-gray-500 mt-1">Creador: {details.creator_name}</p>
          )}
          {details.status && (
            <p className="text-xs mt-1">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1 ${
                  details.status === 'plantado' || details.status === 'verificado'
                    ? 'bg-green-600'
                    : 'bg-yellow-500'
                }`}
              ></span>
              {statusLabels[details.status] || details.status}
            </p>
          )}
          {details.message && (
            <p className="text-xs text-gray-600 mt-1 italic">"{details.message}"</p>
          )}
        </>
      ) : (
        <>
          <p className="text-xs text-gray-500">
            Creado:{' '}
            {details.planted_at
              ? new Date(details.planted_at).toLocaleDateString()
              : 'Fecha desconocida'}
          </p>
          <p className="text-xs mt-1">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1 ${
                details.status === 'plantado' || details.status === 'verificado'
                  ? 'bg-green-600'
                  : 'bg-yellow-500'
              }`}
            ></span>
            {statusLabels[details.status] || details.status}
          </p>
          {details.message && (
            <p className="text-xs text-gray-600 mt-1 italic">"{details.message}"</p>
          )}
        </>
      )}
    </div>
  );
};

// Función de comparación
const areEqual = (prevProps, nextProps) => {
  // Comparar props simples
  if (prevProps.height !== nextProps.height) return false;
  if (prevProps.showFilters !== nextProps.showFilters) return false;
  if (prevProps.restrictToCordoba !== nextProps.restrictToCordoba) return false;
  if (prevProps.restrictToGreenSpaces !== nextProps.restrictToGreenSpaces) return false;
  if (prevProps.showGreenSpaces !== nextProps.showGreenSpaces) return false;
  if (prevProps.defaultOpenTreeId !== nextProps.defaultOpenTreeId) return false;

  // Comparar arrays de center y selectedLocation
  if (JSON.stringify(prevProps.center) !== JSON.stringify(nextProps.center)) return false;
  if (JSON.stringify(prevProps.selectedLocation) !== JSON.stringify(nextProps.selectedLocation))
    return false;

  // Comparar zoom
  if (prevProps.zoom !== nextProps.zoom) return false;

  // Comparar array de trees (más importante)
  const prevTrees = prevProps.trees || [];
  const nextTrees = nextProps.trees || [];

  // Si las longitudes son diferentes, definitivamente han cambiado
  if (prevTrees.length !== nextTrees.length) return false;

  // Comparar IDs y propiedades relevantes de los árboles
  // Solo comparar propiedades que afectan la visualización
  for (let i = 0; i < prevTrees.length; i++) {
    const prev = prevTrees[i];
    const next = nextTrees[i];

    if (prev.id !== next.id) return false;
    if (prev.latitude !== next.latitude) return false;
    if (prev.longitude !== next.longitude) return false;
    if (prev.status !== next.status) return false;
    if (prev.name !== next.name) return false;
    if (prev.type !== next.type) return false;
    if (prev.isMyProject !== next.isMyProject) return false;
  }

  // Si todas las comparaciones pasaron, son iguales
  return true;
};

// Envolver en React.memo con comparación personalizada para evitar re-renders innecesarios
export default React.memo(TreeMap, areEqual);
