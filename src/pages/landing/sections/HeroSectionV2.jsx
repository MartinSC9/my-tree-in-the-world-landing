import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import heroBackground from '@/assets/images/login-background.jpeg';

// Cache de iconos
const heroIconCache = {};
const createHeroTreeIcon = (status) => {
  if (heroIconCache[status]) return heroIconCache[status];
  const color =
    status === 'plantada' || status === 'plantado' || status === 'verificado'
      ? 'bg-emerald-500'
      : 'bg-amber-500';
  const icon = L.divIcon({
    html: `<div class="flex items-center justify-center w-7 h-7 rounded-full ${color} text-white shadow-lg shadow-emerald-500/30">
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

const MapCenterUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

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
const isInCordoba = (lat, lng) => lat >= -35.1 && lat <= -29.5 && lng >= -65.8 && lng <= -61.7;
const roundCoord = (val) => Math.round(val * 100) / 100;

// Floating particles for the hero
const HeroParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
    {Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          background: `rgba(52, 211, 153, ${0.15 + Math.random() * 0.25})`,
        }}
        animate={{
          y: [0, -(20 + Math.random() * 40), 0],
          x: [0, (Math.random() - 0.5) * 20, 0],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.2, 0.5],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          delay: Math.random() * 6,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

// Animated trust indicator
const TrustItem = ({ icon: Icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.2 + delay, duration: 0.5 }}
    className="flex items-center gap-2 group"
  >
    <div className="relative">
      <Icon className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
      <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <span className="text-white/50 group-hover:text-white/80 transition-colors text-sm">
      {text}
    </span>
  </motion.div>
);

const HeroSectionV2 = ({
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
  const [locationStatus, setLocationStatus] = useState('idle');

  useEffect(() => {
    const timer = setTimeout(() => setShowMap(true), 600);
    return () => clearTimeout(timer);
  }, []);

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

  const nearbyTrees = useMemo(() => {
    if (!userLocation) return [];
    return validTrees.filter(
      (t) =>
        distanceKm(userLocation.lat, userLocation.lng, Number(t.latitude), Number(t.longitude)) <=
        NEARBY_RADIUS_KM
    );
  }, [validTrees, userLocation]);

  const mapCenter = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (validTrees.length === 0) return [-31.42, -64.18];
    const avgLat = validTrees.reduce((sum, t) => sum + Number(t.latitude), 0) / validTrees.length;
    const avgLng = validTrees.reduce((sum, t) => sum + Number(t.longitude), 0) / validTrees.length;
    return [avgLat, avgLng];
  }, [validTrees, userLocation]);

  const mapZoom = userLocation ? 13 : validTrees.length > 0 ? 12 : 13;
  const treesToShow = userLocation ? nearbyTrees : validTrees;
  const isNearbyMode = !!userLocation;
  const hasLowDensity = isNearbyMode && nearbyTrees.length <= FEW_TREES_THRESHOLD;

  const mapFooterContent = useMemo(() => {
    if (isNearbyMode) {
      if (nearbyTrees.length === 0) {
        return {
          title: 'No hay arboles cerca tuyo',
          subtitle: 'Se el primero en plantar en tu zona',
          highlight: true,
        };
      }
      if (hasLowDensity) {
        return {
          title: `${nearbyTrees.length} ${nearbyTrees.length === 1 ? 'arbol' : 'arboles'} cerca tuyo`,
          subtitle: 'Tu zona necesita mas verde',
          highlight: true,
        };
      }
      return {
        title: `${nearbyTrees.length} arboles cerca tuyo`,
        subtitle: 'Suma el tuyo al mapa',
        highlight: false,
      };
    }
    return {
      title: `${totalTrees || validTrees.length || 0} arboles plantados`,
      subtitle: 'Datos en tiempo real',
      highlight: false,
    };
  }, [isNearbyMode, nearbyTrees.length, hasLowDensity, totalTrees, validTrees.length]);

  return (
    <section
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax Background with enhanced overlay */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <img
          src={heroBackground}
          alt="Bosque"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darker, more dramatic gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </motion.div>

      {/* Floating particles */}
      <HeroParticles />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="container-wide relative z-10 px-4 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge with glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-full px-5 py-2.5 text-sm font-medium tracking-wide text-emerald-300">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Leaf className="h-4 w-4" />
                </motion.span>
                Plataforma de reforestacion
              </span>
            </motion.div>

            {/* Title with staggered reveal */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white"
              >
                Planta un arbol real
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]"
              >
                <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
                  desde donde estes
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg md:text-xl text-white/50 mb-10 leading-relaxed max-w-xl"
            >
              Con ubicacion GPS, chapa QR y seguimiento en vivo. Vos elegis donde, nosotros lo
              plantamos.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button
                onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
                className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
              >
                <TreePine className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Planta tu arbol
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/mapa"
                className="px-8 py-4 border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 text-white font-medium text-lg rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Globe className="h-5 w-5" />
                Ver mapa global
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6">
              <TrustItem icon={Shield} text="Transparencia total" delay={0} />
              <TrustItem icon={CheckCircle} text="Arboles verificados" delay={0.1} />
              <TrustItem icon={Leaf} text="Especies nativas" delay={0.2} />
              <TrustItem icon={Users} text="Comunidad activa" delay={0.3} />
            </div>
          </div>

          {/* Right Content - Mini Map with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:block"
          >
            <Link to="/mapa" className="block group">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-emerald-400/30 transition-all duration-700 shadow-2xl shadow-black/60">
                {/* Glow effect behind map */}
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

                {/* Mini mapa */}
                <div className="relative h-[340px] pointer-events-none hero-mini-map">
                  <AnimatePresence mode="wait">
                    {showMap ? (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="h-full"
                      >
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

                          {treesToShow.map((tree) => (
                            <Marker
                              key={tree.id}
                              position={[Number(tree.latitude), Number(tree.longitude)]}
                              icon={createHeroTreeIcon(tree.status)}
                            />
                          ))}
                        </MapContainer>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="loading"
                        className="h-full w-full bg-black/80 flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Globe className="h-10 w-10 text-emerald-500/40" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scanline effect overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                    }}
                  />
                </div>

                {/* Footer del mapa */}
                <div
                  className={`px-5 py-4 flex items-center justify-between transition-all duration-500 ${
                    mapFooterContent.highlight
                      ? 'bg-gradient-to-r from-emerald-950/95 to-black/95'
                      : 'bg-black/95'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        mapFooterContent.highlight ? 'bg-emerald-500/20' : 'bg-white/[0.05]'
                      }`}
                    >
                      {mapFooterContent.highlight ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                        </motion.div>
                      ) : userLocation ? (
                        <MapPin className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <TreePine className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{mapFooterContent.title}</p>
                      <p
                        className={`text-xs ${mapFooterContent.highlight ? 'text-emerald-400/70' : 'text-white/30'}`}
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
          className="flex flex-col items-center cursor-pointer mt-16"
          onClick={() => carouselRef.current?.scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-white/20 text-xs uppercase tracking-[0.3em]">Scroll</span>
            <div className="w-6 h-10 border border-white/15 rounded-full flex items-start justify-center p-1.5">
              <motion.div
                className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSectionV2;
