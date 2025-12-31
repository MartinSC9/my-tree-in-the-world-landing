/**
 * Servicio para obtener espacios verdes de Córdoba Capital usando OpenStreetMap Overpass API
 */

// Límites de Córdoba Capital
const CORDOBA_BOUNDS = {
  south: -31.5,
  west: -64.25,
  north: -31.33,
  east: -64.1,
};

/**
 * Consulta espacios verdes de Córdoba Capital vía Overpass API con reintentos
 * Incluye: parques, plazas, jardines, áreas recreativas
 * @param {number} retries - Número de reintentos restantes
 * @param {number} delay - Delay entre reintentos en ms
 */
export const fetchGreenSpaces = async (retries = 3, delay = 1000) => {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';

  // Query de Overpass QL simplificada - busca cualquier área verde
  const query = `
    [out:json][timeout:60];
    (
      // Todos los parques y jardines
      way["leisure"~"park|garden|recreation_ground|playground|pitch|dog_park"](${CORDOBA_BOUNDS.south},${CORDOBA_BOUNDS.west},${CORDOBA_BOUNDS.north},${CORDOBA_BOUNDS.east});

      // Áreas verdes generales
      way["landuse"~"grass|meadow|recreation_ground|village_green|greenfield"](${CORDOBA_BOUNDS.south},${CORDOBA_BOUNDS.west},${CORDOBA_BOUNDS.north},${CORDOBA_BOUNDS.east});

      // Plazas públicas
      way["highway"="pedestrian"]["area"="yes"](${CORDOBA_BOUNDS.south},${CORDOBA_BOUNDS.west},${CORDOBA_BOUNDS.north},${CORDOBA_BOUNDS.east});

      // Áreas naturales
      way["natural"~"wood|scrub|grassland"](${CORDOBA_BOUNDS.south},${CORDOBA_BOUNDS.west},${CORDOBA_BOUNDS.north},${CORDOBA_BOUNDS.east});
    );
    out body;
    >;
    out skel qt;
  `;
  try {
    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      console.error('❌ Overpass API error:', response.status, response.statusText);
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    // Procesar y convertir a polígonos
    const spaces = processGreenSpaces(data);

    // Si no se obtuvieron espacios y quedan reintentos, reintentar
    if (spaces.length === 0 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchGreenSpaces(retries - 1, delay * 2); // Delay exponencial
    }

    return spaces;
  } catch (error) {
    console.error('❌ Error fetching green spaces:', error);

    // Si quedan reintentos, intentar de nuevo
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchGreenSpaces(retries - 1, delay * 2); // Delay exponencial
    }

    // Si no quedan reintentos, retornar array vacío
    console.error('❌ Todos los reintentos fallaron');
    return [];
  }
};

/**
 * Procesa la respuesta de Overpass API y convierte a polígonos
 */
const processGreenSpaces = (data) => {
  const nodes = {};
  const greenSpaces = [];
  // Primero, indexar todos los nodos por ID
  let nodeCount = 0;
  data.elements.forEach((element) => {
    if (element.type === 'node') {
      nodes[element.id] = {
        lat: element.lat,
        lng: element.lon,
      };
      nodeCount++;
    }
  });
  // Luego, procesar ways (polígonos)
  let wayCount = 0;
  data.elements.forEach((element) => {
    if (element.type === 'way' && element.nodes && element.nodes.length > 0) {
      wayCount++;
      const coordinates = element.nodes
        .map((nodeId) => nodes[nodeId])
        .filter((coord) => coord !== undefined);

      // Solo incluir polígonos válidos (mínimo 3 puntos)
      if (coordinates.length >= 3) {
        const space = {
          id: element.id,
          name: element.tags?.name || 'Espacio verde',
          type:
            element.tags?.leisure ||
            element.tags?.landuse ||
            element.tags?.natural ||
            element.tags?.highway ||
            'green_space',
          coordinates: coordinates,
        };
        greenSpaces.push(space);
      }
    }
  });

  return greenSpaces;
};

/**
 * Algoritmo Point-in-Polygon (Ray Casting)
 * Determina si un punto está dentro de un polígono
 */
export const isPointInPolygon = (point, polygon) => {
  const { lat, lng } = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Verifica si un punto está dentro de algún espacio verde
 */
export const isPointInGreenSpace = (lat, lng, greenSpaces) => {
  const point = { lat, lng };

  for (let space of greenSpaces) {
    if (isPointInPolygon(point, space.coordinates)) {
      return {
        isInside: true,
        spaceName: space.name,
        spaceType: space.type,
      };
    }
  }

  return {
    isInside: false,
  };
};

/**
 * Cache local de espacios verdes para evitar consultas repetidas
 * - Cache en memoria (más rápido para la sesión actual)
 * - Cache en localStorage (persiste entre recargas)
 */
let cachedGreenSpaces = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora
const CACHE_KEY = 'green_spaces_cache';
const CACHE_TIMESTAMP_KEY = 'green_spaces_cache_timestamp';

/**
 * Carga espacios verdes desde localStorage si están disponibles y no expirados
 */
const loadFromLocalStorage = () => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!cachedData || !cachedTime) {
      return null;
    }

    const timestamp = parseInt(cachedTime, 10);
    const now = Date.now();

    // Verificar si el cache ha expirado
    if (now - timestamp >= CACHE_DURATION) {
      // Limpiar cache expirado
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }

    const greenSpaces = JSON.parse(cachedData);
    // Calcular tiempo restante
    const remainingMs = CACHE_DURATION - (now - timestamp);
    const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
    return {
      data: greenSpaces,
      timestamp: timestamp,
    };
  } catch (error) {
    console.error('❌ Error al cargar cache desde localStorage:', error);
    // Limpiar cache corrupto
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    return null;
  }
};

/**
 * Guarda espacios verdes en localStorage
 */
const saveToLocalStorage = (greenSpaces, timestamp) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(greenSpaces));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());

    // Calcular tamaño aproximado del cache
    const sizeKB = (JSON.stringify(greenSpaces).length / 1024).toFixed(2);
  } catch (error) {
    console.error('❌ Error al guardar cache en localStorage:', error);
    // Si falla (por ejemplo, por límite de espacio), no es crítico
  }
};

export const getGreenSpaces = async () => {
  const now = Date.now();

  // 1. Intentar cargar desde cache en memoria (más rápido)
  if (
    cachedGreenSpaces &&
    cachedGreenSpaces.length > 0 &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedGreenSpaces;
  }

  // 2. Intentar cargar desde localStorage
  const localCache = loadFromLocalStorage();
  if (localCache && localCache.data.length > 0) {
    cachedGreenSpaces = localCache.data;
    cacheTimestamp = localCache.timestamp;
    return cachedGreenSpaces;
  }

  // 3. Consultar API si no hay cache válido
  const fetchedSpaces = await fetchGreenSpaces();

  // 4. Solo guardar en cache si se obtuvieron espacios verdes válidos
  if (fetchedSpaces && fetchedSpaces.length > 0) {
    cachedGreenSpaces = fetchedSpaces;
    cacheTimestamp = now;
    saveToLocalStorage(cachedGreenSpaces, cacheTimestamp);
  } else {
    // Si ya teníamos cache anterior, mantenerlo aunque esté expirado
    if (cachedGreenSpaces && cachedGreenSpaces.length > 0) {
      return cachedGreenSpaces;
    }
    // Si no hay cache anterior, retornar array vacío sin guardarlo
    return [];
  }

  return cachedGreenSpaces;
};

/**
 * Limpia el cache de espacios verdes (útil para debugging o forzar actualización)
 */
export const clearGreenSpacesCache = () => {
  cachedGreenSpaces = null;
  cacheTimestamp = null;
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
};
