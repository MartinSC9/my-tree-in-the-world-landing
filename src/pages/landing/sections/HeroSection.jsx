import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TreePine,
  Globe,
  Users,
  Leaf,
  Shield,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@shared/components/ui/button';
import heroBackground from '@/assets/images/login-background.jpeg';

// Cache de iconos de árbol para el mini mapa
const heroIconCache = {};
const createHeroTreeIcon = (status) => {
  if (heroIconCache[status]) return heroIconCache[status];
  const color =
    status === 'plantada' || status === 'plantado' || status === 'verificado'
      ? 'bg-green-600'
      : 'bg-yellow-500';
  const icon = L.divIcon({
    html: `<div class="flex items-center justify-center w-7 h-7 rounded-full ${color} text-white shadow-lg">
             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
               <path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208H104L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320H80L5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5H192v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448H424.5c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320h33.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208h24.9c12.8 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"/>
             </svg>
           </div>`,
    className: 'custom-tree-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  heroIconCache[status] = icon;
  return icon;
};

// Componente para forzar invalidateSize cuando el mapa se monta
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 300);
    const timer2 = setTimeout(() => map.invalidateSize(), 800);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [map]);
  return null;
};

// Componente para re-centrar el mapa cuando cambia el centro
const MapCenterUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

// Distancia en km entre dos puntos (Haversine)
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

// Bounding box provincia de Córdoba, Argentina
const isInCordoba = (lat, lng) => lat >= -35.1 && lat <= -29.5 && lng >= -65.8 && lng <= -61.7;

// Redondear a ~1km para no mostrar ubicación exacta
const roundCoord = (val) => Math.round(val * 100) / 100;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const HeroSection = ({
  heroRef,
  heroOpacity,
  heroScale,
  APP_URL,
  carouselRef,
  trees,
  totalTrees,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | requesting | granted | denied

  useEffect(() => {
    const timer = setTimeout(() => setShowMap(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Pedir geolocation — solo activar si está en Córdoba
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = roundCoord(pos.coords.latitude);
        const lng = roundCoord(pos.coords.longitude);
        if (isInCordoba(lat, lng)) {
          setUserLocation({ lat, lng });
          setLocationStatus('granted');
        } else {
          setLocationStatus('denied');
        }
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  const validTrees = useMemo(() => {
    if (!trees || !Array.isArray(trees)) return [];
    return trees.filter(
      (t) => t.latitude && t.longitude && !isNaN(t.latitude) && !isNaN(t.longitude)
    );
  }, [trees]);

  // Árboles cercanos al usuario
  const nearbyTrees = useMemo(() => {
    if (!userLocation) return [];
    return validTrees.filter(
      (t) =>
        distanceKm(userLocation.lat, userLocation.lng, Number(t.latitude), Number(t.longitude)) <=
        NEARBY_RADIUS_KM
    );
  }, [validTrees, userLocation]);

  // Centro del mapa: ubicación del usuario si la hay, sino promedio de árboles
  const mapCenter = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (validTrees.length === 0) return [-31.42, -64.18];
    const avgLat = validTrees.reduce((sum, t) => sum + Number(t.latitude), 0) / validTrees.length;
    const avgLng = validTrees.reduce((sum, t) => sum + Number(t.longitude), 0) / validTrees.length;
    return [avgLat, avgLng];
  }, [validTrees, userLocation]);

  const mapZoom = userLocation ? 13 : validTrees.length > 0 ? 12 : 13;

  // Árboles a mostrar en el mapa
  const treesToShow = userLocation ? nearbyTrees : validTrees;
  const isNearbyMode = !!userLocation;
  const hasLowDensity = isNearbyMode && nearbyTrees.length <= FEW_TREES_THRESHOLD;

  // CTA dinámico para el footer del mapa
  const mapFooterContent = useMemo(() => {
    if (isNearbyMode) {
      if (nearbyTrees.length === 0) {
        return {
          title: 'No hay árboles cerca tuyo',
          subtitle: 'Sé el primero en plantar en tu zona',
          highlight: true,
        };
      }
      if (hasLowDensity) {
        return {
          title: `${nearbyTrees.length} ${nearbyTrees.length === 1 ? 'árbol' : 'árboles'} cerca tuyo`,
          subtitle: 'Tu zona necesita más verde',
          highlight: true,
        };
      }
      return {
        title: `${nearbyTrees.length} árboles cerca tuyo`,
        subtitle: 'Sumá el tuyo al mapa',
        highlight: false,
      };
    }
    return {
      title: `${totalTrees || validTrees.length || 0} árboles plantados`,
      subtitle: 'Datos en tiempo real',
      highlight: false,
    };
  }, [isNearbyMode, nearbyTrees.length, hasLowDensity, totalTrees, validTrees.length]);

  return (
    <section
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <img
          src={heroBackground}
          alt="Bosque"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="container-wide relative z-10 px-4 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-white"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <Leaf className="h-4 w-4 text-emerald-400" />
                Plataforma de reforestación
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
            >
              Plantá un árbol real{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                desde donde estés
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-green-100/90 mb-8 leading-relaxed max-w-xl"
            >
              Con ubicación GPS, chapa QR y seguimiento en vivo. Vos elegís dónde, nosotros lo
              plantamos.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
                size="lg"
                className="btn-primary group text-lg px-8 bg-emerald-500 hover:bg-emerald-600"
              >
                <TreePine className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Plantá tu árbol
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg px-8"
              >
                <Link to="/mapa">
                  <Globe className="h-5 w-5 mr-2" />
                  Ver Mapa Global
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-6 text-sm text-green-100/70"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Transparencia total</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Árboles reales verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>Especies nativas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Comunidad activa</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Mini Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <Link to="/mapa" className="block group">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 hover:border-emerald-400/30 transition-all duration-500">
                {/* Mini mapa */}
                <div className="h-[320px] relative pointer-events-none hero-mini-map">
                  {showMap ? (
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      scrollWheelZoom={false}
                      dragging={false}
                      zoomControl={false}
                      attributionControl={false}
                      doubleClickZoom={false}
                      touchZoom={false}
                      style={{ height: '100%', width: '100%', borderRadius: 0 }}
                    >
                      <MapResizer />
                      <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                      {/* Radio de cercanía (sutil) */}
                      {userLocation && (
                        <Circle
                          center={[userLocation.lat, userLocation.lng]}
                          radius={NEARBY_RADIUS_KM * 1000}
                          pathOptions={{
                            color: '#34d399',
                            fillColor: '#10b981',
                            fillOpacity: 0.12,
                            weight: 2,
                            opacity: 0.5,
                            dashArray: '8 5',
                          }}
                        />
                      )}

                      {/* Ubicación del usuario */}
                      {userLocation && (
                        <CircleMarker
                          center={[userLocation.lat, userLocation.lng]}
                          radius={5}
                          pathOptions={{
                            color: '#3b82f6',
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            weight: 3,
                            opacity: 0.6,
                          }}
                        />
                      )}

                      {/* Árboles */}
                      {treesToShow.map((tree) => (
                        <Marker
                          key={tree.id}
                          position={[Number(tree.latitude), Number(tree.longitude)]}
                          icon={createHeroTreeIcon(tree.status)}
                        />
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-gray-700 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Footer del mapa - dinámico */}
                <div
                  className={`px-5 py-4 flex items-center justify-between transition-colors ${
                    mapFooterContent.highlight
                      ? 'bg-gradient-to-r from-emerald-900/95 to-gray-900/95 backdrop-blur-sm'
                      : 'bg-gray-900/95 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        mapFooterContent.highlight ? 'bg-emerald-500/30' : 'bg-emerald-500/20'
                      }`}
                    >
                      {mapFooterContent.highlight ? (
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                      ) : userLocation ? (
                        <MapPin className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <TreePine className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{mapFooterContent.title}</p>
                      <p
                        className={`text-xs ${mapFooterContent.highlight ? 'text-emerald-300/80' : 'text-gray-400'}`}
                      >
                        {mapFooterContent.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {mapFooterContent.highlight ? 'Plantar ahora' : 'Ver mapa'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center cursor-pointer mt-12"
          onClick={() => carouselRef.current?.scrollIntoView({ behavior: 'smooth' })}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-white/60 text-sm mb-2">Descubrí más</span>
          <div className="border-2 border-white/40 rounded-full p-2">
            <ChevronDown className="h-5 w-5 text-white/60" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
