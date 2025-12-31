import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  TreePine,
  Globe,
  Users,
  Award,
  Leaf,
  Heart,
  QrCode,
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  FileText,
  Building2,
  Trophy,
  Gift,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { statsService } from '@features/trees/services';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';
import { formatCurrency } from '@/utils/currencyUtils';
import heroBackground from '@/assets/images/login-background.jpeg';

// Carousel images
import carousel1 from '@/assets/images/carousel/1.png';
import carousel2 from '@/assets/images/carousel/2.png';
import carousel3 from '@/assets/images/carousel/3.png';
import carousel4 from '@/assets/images/carousel/4.png';
import carousel5 from '@/assets/images/carousel/5.png';
import carousel6 from '@/assets/images/carousel/6.png';
import carousel7 from '@/assets/images/carousel/7.png';
import carousel8 from '@/assets/images/carousel/8.png';
import carousel9 from '@/assets/images/carousel/9.png';

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const LandingHome = () => {
  const { trees, loadTrees } = useTree();
  const { user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Estado para las estadisticas de landing (endpoint ligero)
  const [landingStats, setLandingStats] = useState({
    totalTrees: 0,
    plantedTrees: 0,
    totalCountries: 0,
    totalCompanies: 0,
  });

  // Estado para top empresas
  const [topCompanies, setTopCompanies] = useState([]);

  // Cargar stats y top empresas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getLandingStats();
        setLandingStats(data);
      } catch (error) {
        console.error('Error cargando stats:', error);
      }
    };

    const fetchTopCompanies = async () => {
      try {
        const companies = await statsService.getTopCompanies(5);
        setTopCompanies(companies || []);
      } catch (error) {
        console.error('Error cargando top empresas:', error);
      }
    };

    fetchStats();
    fetchTopCompanies();
    loadTrees();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, getRedirectPath, navigate]);

  const stats = [
    {
      icon: TreePine,
      label: 'Árboles Comprados',
      value: landingStats.totalTrees,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/50',
    },
    {
      icon: Leaf,
      label: 'Ya Plantados',
      value: landingStats.plantedTrees,
      colorClass: 'text-teal-600 dark:text-teal-400',
      bgClass: 'bg-teal-100 dark:bg-teal-900/50',
    },
    {
      icon: Globe,
      label: 'Países',
      value: landingStats.totalCountries,
      colorClass: 'text-sky-600 dark:text-sky-400',
      bgClass: 'bg-sky-100 dark:bg-sky-900/50',
    },
    {
      icon: Users,
      label: 'Árboles Colaborativos',
      value: landingStats.collaborativeTrees || 0,
      colorClass: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-100 dark:bg-purple-900/50',
    },
  ];

  // Section refs for scroll animations
  const carouselRef = useRef(null);
  const statsRef = useRef(null);
  const uniqueRef = useRef(null);
  const impactRef = useRef(null);
  const howItWorksRef = useRef(null);
  const plantaSinPlataRef = useRef(null);
  const topCompaniesRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });
  const uniqueInView = useInView(uniqueRef, { once: true, margin: '-100px' });
  const impactInView = useInView(impactRef, { once: true, margin: '-100px' });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: '-100px' });
  const topCompaniesInView = useInView(topCompaniesRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
                Tu Árbol,{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  Tu Legado
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-green-100/90 mb-8 leading-relaxed max-w-xl"
              >
                Entra gratis, explora la plataforma y únete a nuestra comunidad. Próximamente podrás
                plantar tu propio árbol.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  onClick={() => window.open(`${APP_URL}/`, '_blank')}
                  size="lg"
                  className="btn-primary group text-lg px-8 bg-emerald-500 hover:bg-emerald-600"
                >
                  <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Entrar a la App
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
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>Red social integrada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Árboles verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>GPS exacto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>Certificado digital</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Features Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main floating card */}
                <div className="glass-dark rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-emerald-500/20 p-3 rounded-xl">
                      <Users className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">Comunidad</p>
                      <p className="text-green-200/70">Únete ahora</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <Heart className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-white">Comparte tu pasión por el ambiente</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <Globe className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-white">Explora el mapa global de árboles</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <TreePine className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-white">Próximamente: planta tu árbol</p>
                    </div>
                  </div>
                </div>

                {/* Secondary floating card */}
                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">100% Gratis</p>
                      <p className="text-xs text-green-200/70">Regístrate sin costo</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center cursor-pointer mt-12"
            onClick={() => carouselRef.current?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-white/60 text-sm mb-2">Descubre más</span>
            <div className="border-2 border-white/40 rounded-full p-2">
              <ChevronDown className="h-5 w-5 text-white/60" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CAROUSEL: App Social Preview */}
      <section
        ref={carouselRef}
        className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-5">
              <Users className="h-4 w-4" />
              <span>Nuestra Comunidad</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Descubre la{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                App Social
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Conecta con otros plantadores, comparte tu progreso y sigue el crecimiento de tu árbol
              en tiempo real.
            </p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Gradient fades on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

            {/* Scrolling carousel */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6 py-4"
                animate={{ x: [0, -2880] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 40,
                    ease: 'linear',
                  },
                }}
              >
                {/* App Screenshots - duplicated for seamless loop */}
                {[...Array(2)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {[
                      carousel1,
                      carousel2,
                      carousel3,
                      carousel4,
                      carousel5,
                      carousel6,
                      carousel7,
                      carousel8,
                      carousel9,
                    ].map((img, index) => (
                      <div key={`${setIndex}-${index}`} className="flex-shrink-0">
                        <div className="relative group">
                          {/* Phone frame effect */}
                          <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-emerald-500/30">
                            {/* Screen */}
                            <div className="rounded-[2rem] overflow-hidden bg-black">
                              {/* Notch */}
                              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full z-10" />
                              <img
                                src={img}
                                alt={`App screenshot ${index + 1}`}
                                className="w-64 md:w-72 h-auto object-cover"
                              />
                            </div>
                          </div>
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => window.open(`${APP_URL}/`, '_blank')}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg px-8 shadow-lg shadow-emerald-500/30"
            >
              <Users className="h-5 w-5 mr-2" />
              Explora la App
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="section-padding relative overflow-hidden bg-white dark:bg-gray-900"
      >
        <div className="absolute top-0 right-0 w-96 h-96 blob-shape nature-blob" />
        <div className="absolute bottom-0 left-0 w-80 h-80 blob-shape earth-blob" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={scaleIn}>
                <div className="stats-card rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${stat.bgClass}`}
                  >
                    <stat.icon className={`h-10 w-10 ${stat.colorClass}`} />
                  </div>
                  <motion.div
                    className={`font-display text-5xl font-bold mb-2 ${stat.colorClass}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* QUE HACE UNICO A TU ARBOL - Nueva seccion (reemplaza Nuestra Mision) */}
      <section ref={uniqueRef} className="section-padding relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/arbol-identidad.jpeg')" }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={uniqueInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <QrCode className="h-16 w-16 mx-auto mb-6 text-white/90 floating" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title !text-white mb-6">
              Cada Árbol Tiene su Propia{' '}
              <span className="text-gradient bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                Identidad
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-green-100/90 max-w-3xl mx-auto leading-relaxed"
            >
              Cuando plantas con nosotros, tu árbol recibe una identidad única y verificable.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={uniqueInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="glass-dark rounded-3xl p-8 md:p-12"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Physical Tag */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-emerald-400/20 p-4 rounded-xl">
                    <Shield className="h-7 w-7 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Chapa Física con QR</h4>
                  </div>
                </div>
                <ul className="space-y-3 text-green-100">
                  {[
                    'Acero inoxidable anti-oxidación',
                    'Durabilidad garantizada 10+ años',
                    'Tu nombre grabado en la chapa',
                    'Instalada junto al árbol',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Web Page */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-emerald-400/20 p-4 rounded-xl">
                    <Globe className="h-7 w-7 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Página Web Única</h4>
                  </div>
                </div>
                <ul className="space-y-3 text-green-100">
                  {[
                    'Foto real de tu árbol plantado',
                    'Ubicación exacta con GPS',
                    'Especie y fecha de plantación',
                    'Información de quién lo plantó',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certificate */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-emerald-400/20 p-4 rounded-xl">
                    <FileText className="h-7 w-7 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Certificado Digital</h4>
                  </div>
                </div>
                <ul className="space-y-3 text-green-100">
                  {[
                    'Coordenadas GPS exactas',
                    'Descargable en formato PDF',
                    'Compartible en redes sociales',
                    'Verificable online con QR',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CADENA DE IMPACTO - Con animaciones y colores vibrantes */}
      <section
        ref={impactRef}
        className="py-24 md:py-32 px-4 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden"
      >
        {/* Decoraciones de fondo animadas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 text-pink-400" />
              <span>Impacto Real</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Tu Compra Mueve una{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Cadena de Impacto
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Cada árbol activa un ciclo que beneficia al planeta y a las comunidades locales.
            </p>
          </motion.div>

          {/* Cadena de impacto - Cards con animaciones */}
          <div className="relative max-w-5xl mx-auto">
            {/* Línea conectora (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-500 to-teal-500 -translate-y-1/2 rounded-full opacity-30" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Card 1 - Tú Plantas */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-center text-white shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <motion.div
                    className="text-4xl md:text-5xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🌱
                  </motion.div>
                  <h4 className="font-display text-lg md:text-xl font-bold">Tú</h4>
                  <h4 className="font-display text-lg md:text-xl font-bold">Plantas</h4>
                  <div className="mt-3 text-xs text-emerald-100 opacity-80">Paso 1</div>
                </div>
              </motion.div>

              {/* Card 2 - Viveros */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-center text-white shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <motion.div
                    className="text-4xl md:text-5xl mb-3"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  >
                    🏡
                  </motion.div>
                  <h4 className="font-display text-lg md:text-xl font-bold">Viveros</h4>
                  <h4 className="font-display text-lg md:text-xl font-bold">Venden</h4>
                  <div className="mt-3 text-xs text-amber-100 opacity-80">Paso 2</div>
                </div>
              </motion.div>

              {/* Card 3 - Empleo */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-center text-white shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <motion.div
                    className="text-4xl md:text-5xl mb-3"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  >
                    👷
                  </motion.div>
                  <h4 className="font-display text-lg md:text-xl font-bold">Generas</h4>
                  <h4 className="font-display text-lg md:text-xl font-bold">Empleo</h4>
                  <div className="mt-3 text-xs text-rose-100 opacity-80">Paso 3</div>
                </div>
              </motion.div>

              {/* Card 4 - Planeta */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-center text-white shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <motion.div
                    className="text-4xl md:text-5xl mb-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    🌍
                  </motion.div>
                  <h4 className="font-display text-lg md:text-xl font-bold">Planeta</h4>
                  <h4 className="font-display text-lg md:text-xl font-bold">Más Verde</h4>
                  <div className="mt-3 text-xs text-cyan-100 opacity-80">Resultado</div>
                </div>
              </motion.div>
            </div>

            {/* Flechas animadas entre cards (mobile) */}
            <div className="flex md:hidden justify-center my-4">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl text-white/50"
              >
                →
              </motion.div>
            </div>
          </div>

          {/* Mensajes de impacto con colores correspondientes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-white">
                <span className="font-bold text-emerald-400">Tú plantas</span>
                <span className="text-gray-300"> un árbol con tu nombre.</span>
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 text-center">
              <p className="text-white">
                <span className="font-bold text-amber-400">Viveros</span>
                <span className="text-gray-300"> venden y generan ingresos.</span>
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-rose-500/30 rounded-xl p-4 text-center">
              <p className="text-white">
                <span className="font-bold text-rose-400">Trabajo digno</span>
                <span className="text-gray-300"> para familias locales.</span>
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 text-center">
              <p className="text-white">
                <span className="font-bold text-cyan-400">Planeta más verde</span>
                <span className="text-gray-300"> para todos.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMO FUNCIONA - Simplificado con precios */}
      <section
        ref={howItWorksRef}
        className="section-padding premium-gradient relative overflow-hidden"
      >
        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="section-title mb-6">
              Cómo Funciona
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
              En 3 simples pasos, tu árbol estará plantado y con su propia identidad.
            </motion.p>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
          >
            {[
              {
                image: '/images/1.png',
                title: '1. Compra tu Árbol',
                desc: 'Elige ubicación, nombre y especie.',
              },
              {
                image: '/images/2.png',
                title: '2. Plantación Real',
                desc: 'Viveros locales preparan tu árbol. Plantadores profesionales lo plantan. Recibirás fotos del proceso.',
              },
              {
                image: '/images/3.png',
                title: '3. Tu Árbol, Tu Legado',
                desc: 'Chapa QR instalada junto al árbol. Certificado digital descargable. Visítalo cuando quieras.',
              },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center flex w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full w-full border border-gray-100 dark:border-gray-700">
                  <div className="overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-xl font-semibold text-gray-800 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3 flex-1">
                      {step.desc}
                    </p>
                    {step.price && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                        {step.price}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Planta Sin Plata Section */}
      <section
        ref={plantaSinPlataRef}
        className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden"
      >
        {/* Elementos decorativos sutiles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-100/30 dark:bg-emerald-900/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gray-200/30 dark:bg-gray-800/30 blur-3xl" />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Badge simple */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-5">
              <Gift className="h-4 w-4" />
              <span>No necesitas dinero para empezar</span>
            </div>

            {/* Titulo limpio */}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              <span className="text-emerald-600 dark:text-emerald-400">3</span> Formas de Plantar{' '}
              <span className="text-emerald-600 dark:text-emerald-400">GRATIS</span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              No hace falta dinero para ser parte del cambio. Elige la opción que mejor te funcione.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Opcion 1: Referidos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col group-hover:-translate-y-1">
                {/* Numero de opcion */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    1
                  </span>
                </div>

                {/* Icono */}
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                  <Users className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Invita 5 Amigos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 text-sm leading-relaxed">
                  Comparte tu código. Cuando 5 amigos planten, tienes un{' '}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    árbol gratis
                  </span>
                  .
                </p>
              </div>
            </motion.div>

            {/* Opcion 2: Colaborativo - Card destacada */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <div className="relative bg-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
                {/* Badge popular */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    MÁS POPULAR
                  </div>
                </div>

                {/* Numero de opcion */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">2</span>
                </div>

                {/* Icono */}
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:scale-105 transition-transform border border-white/30">
                  <Heart className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Árbol Colaborativo</h3>
                <p className="text-emerald-100 mb-4 flex-1 text-sm leading-relaxed">
                  Crea un proyecto y compártelo. Tus amigos{' '}
                  <span className="font-semibold text-white">aportan lo que puedan</span> para
                  completar la meta.
                </p>
              </div>
            </motion.div>

            {/* Opcion 3: QR Productos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col group-hover:-translate-y-1">
                {/* Numero de opcion */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    3
                  </span>
                </div>

                {/* Icono */}
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                  <QrCode className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Escanea y Gana
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 text-sm leading-relaxed">
                  Productos de empresas partner tienen QR. Escanea y{' '}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    participa en sorteos
                  </span>{' '}
                  de árboles.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section
        ref={topCompaniesRef}
        className="section-padding bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={topCompaniesInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp}>
              <Building2 className="h-14 w-14 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title mb-4">
              Empresas que Hacen la Diferencia
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
              Estas empresas lideran el cambio con proyectos de reforestación.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={topCompaniesInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className={`grid gap-6 ${
              topCompanies.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : topCompanies.length === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                  : topCompanies.length === 3
                    ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto'
                    : topCompanies.length === 4
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
            }`}
          >
            {topCompanies.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Pronto verás aquí a las empresas que lideran el cambio
                </p>
              </div>
            )}
            {topCompanies.map((company, index) => (
              <motion.div key={company.id} variants={fadeInUp}>
                <Card className="h-full bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-emerald-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    {/* Ranking Badge */}
                    <div className="flex justify-center mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0
                            ? 'bg-yellow-400 text-yellow-900'
                            : index === 1
                              ? 'bg-gray-300 text-gray-700'
                              : index === 2
                                ? 'bg-amber-600 text-amber-100'
                                : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {index < 3 ? (
                          <Trophy className="h-6 w-6" />
                        ) : (
                          <span className="font-bold text-lg">#{index + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-3">
                      {company.company_name || company.username}
                    </h3>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <TreePine className="h-4 w-4" />
                        <span className="font-semibold">
                          {company.completed_projects} proyectos
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(company.total_raised)} recaudado
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA for companies */}
          <motion.div
            initial="hidden"
            animate={topCompaniesInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="text-center mt-10"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Tu empresa también puede ser parte del cambio.
            </p>
            <Button
              onClick={() => navigate('/empresas')}
              variant="outline"
              className="border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Conoce el programa empresarial
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        ref={ctaRef}
        className="section-padding bg-emerald-600 dark:bg-gray-900 relative overflow-hidden"
      >
        {/* Decoraciones de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/30 dark:bg-emerald-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-700/30 dark:bg-emerald-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        {/* Borde superior verde en dark mode */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent dark:block hidden" />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <TreePine className="h-20 w-20 mx-auto mb-6 text-white" />
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Únete a la Comunidad
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Explora la plataforma, conecta con otros y próximamente planta tu propio árbol.
            </p>
            <Button
              onClick={() => window.open(`${APP_URL}/`, '_blank')}
              size="lg"
              className="bg-white hover:bg-emerald-50 text-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white shadow-xl hover:shadow-2xl px-12 py-7 text-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              <Users className="h-6 w-6 mr-3" />
              Entrar a la App
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingHome;
