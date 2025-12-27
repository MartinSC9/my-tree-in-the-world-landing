import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { TreePine, Globe, Users, Award, Leaf, Heart, QrCode, Shield, CheckCircle, ArrowRight, MapPin, TrendingUp, FileText, Building2, Trophy, Gift, Share2, ChevronDown } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { statsService } from '@features/trees/services';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';
import { formatCurrency } from '@/utils/currencyUtils';
import heroBackground from '@/assets/images/login-background.jpeg';




// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const LandingHome = () => {
  const { trees, loadTrees } = useTree();
  const { user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Estado para las estadisticas de landing (endpoint ligero)
  const [landingStats, setLandingStats] = useState({
    totalTrees: 0,
    plantedTrees: 0,
    totalCountries: 0,
    totalCompanies: 0
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
    { icon: TreePine, label: 'Árboles Comprados', value: landingStats.totalTrees, color: 'hsl(152 68% 38%)', bgColor: 'hsl(152 68% 92%)' },
    { icon: Leaf, label: 'Ya Plantados', value: landingStats.plantedTrees, color: 'hsl(165 60% 40%)', bgColor: 'hsl(165 60% 90%)' },
    { icon: Globe, label: 'Países', value: landingStats.totalCountries, color: 'hsl(200 85% 45%)', bgColor: 'hsl(200 85% 92%)' },
    { icon: Users, label: 'Árboles Colaborativos', value: landingStats.collaborativeTrees || 0, color: 'hsl(280 60% 50%)', bgColor: 'hsl(280 60% 92%)' }
  ];

  // Section refs for scroll animations
  const statsRef = useRef(null);
  const uniqueRef = useRef(null);
  const impactRef = useRef(null);
  const howItWorksRef = useRef(null);
  const topCompaniesRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const uniqueInView = useInView(uniqueRef, { once: true, margin: "-100px" });
  const impactInView = useInView(impactRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const topCompaniesInView = useInView(topCompaniesRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
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

              <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                Tu Árbol,{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  Tu Legado
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100/90 mb-8 leading-relaxed max-w-xl">
                Entrá gratis, explorá la plataforma y unite a nuestra comunidad. Próximamente podrás plantar tu propio árbol.
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
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 text-sm text-green-100/70">
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
                      <p className="text-green-200/70">Unite ahora</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <Heart className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-white">Compartí tu pasión por el ambiente</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <Globe className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-white">Explorá el mapa global de árboles</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <TreePine className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-white">Próximamente: plantá tu árbol</p>
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
                      <p className="text-xs text-green-200/70">Registrate sin costo</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center cursor-pointer mt-12"
            onClick={() => statsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white/60 text-sm mb-2">Descubre más</span>
            <div className="border-2 border-white/40 rounded-full p-2">
              <ChevronDown className="h-5 w-5 text-white/60" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* NUEVA SECCION: Planta Sin Plata */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
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
              No hace falta plata para ser parte del cambio. Elegi la opcion que mejor te funcione.
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
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">1</span>
                </div>

                {/* Icono */}
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                  <Users className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Invita 5 Amigos</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 text-sm leading-relaxed">
                  Comparti tu codigo. Cuando 5 amigos planten, vos tenes un <span className="font-semibold text-emerald-600 dark:text-emerald-400">arbol gratis</span>.
                </p>

                {/* Info box */}
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>500 pts por cada amigo</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                    <Trophy className="h-4 w-4 flex-shrink-0" />
                    <span>2,500 pts = Arbol GRATIS</span>
                  </div>
                </div>
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
                    MAS POPULAR
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
                  Creá un proyecto y compartilo. Tus amigos <span className="font-semibold text-white">aportan lo que puedan</span> para completar la meta.
                </p>

                {/* Info box */}
                <div className="bg-white/15 rounded-xl p-3 space-y-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Desde {formatCurrency(500)} por persona</span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm font-semibold">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>30 personas × {formatCurrency(500)} = 1 árbol</span>
                  </div>
                </div>
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
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">3</span>
                </div>

                {/* Icono */}
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                  <QrCode className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Escanea y Gana</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 text-sm leading-relaxed">
                  Productos de empresas partner tienen QR. Escanea y <span className="font-semibold text-emerald-600 dark:text-emerald-400">participa en sorteos</span> de arboles.
                </p>

                {/* Info box */}
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Sin costo, solo escanea</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                    <Gift className="h-4 w-4 flex-shrink-0" />
                    <span>Sorteos mensuales</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Button
              onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl px-10 py-6 text-lg rounded-xl"
            >
              <Leaf className="h-5 w-5 mr-2" />
              Empezá Gratis Ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-padding relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute top-0 right-0 w-96 h-96 blob-shape nature-blob" />
        <div className="absolute bottom-0 left-0 w-80 h-80 blob-shape earth-blob" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={scaleIn}>
                <div className="stats-card rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 feature-icon"
                    style={{ background: stat.bgColor }}
                  >
                    <stat.icon className="h-10 w-10" style={{ color: stat.color }} />
                  </div>
                  <motion.div
                    className="font-display text-5xl font-bold mb-2"
                    style={{ color: stat.color }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{stat.label}</div>
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
            animate={uniqueInView ? "visible" : "hidden"}
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
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100/90 max-w-3xl mx-auto leading-relaxed">
              Cuando plantas con nosotros, tu árbol recibe una identidad única y verificable.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={uniqueInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="glass-dark rounded-3xl p-8 md:p-12"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Physical Tag */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
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
                    'Durabilidad 10+ años',
                    'Nombre personalizado grabado',
                    'Instalada junto al árbol'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Web Page */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-emerald-400/20 p-4 rounded-xl">
                    <Globe className="h-7 w-7 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Página Web Única</h4>
                  </div>
                </div>
                <p className="text-green-200/80 text-sm mb-4">Al escanear el QR, cualquiera puede ver:</p>
                <ul className="space-y-3 text-green-100">
                  {[
                    'Foto de tu árbol',
                    'Ubicación exacta (GPS)',
                    'Especie y fecha de plantación',
                    'CO2 absorbido',
                    'Quién lo plantó'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certificate */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
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
                    'Descargable en PDF',
                    'Compartible en redes',
                    'Verificable online'
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

      {/* IMPACTO TRIPLE - Nueva seccion (reemplaza Environmental Commitment y Beneficios Gratuitos) */}
      <section ref={impactRef} className="py-24 md:py-32 px-4 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background image muy transparente */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15]"
          style={{ backgroundImage: "url('/images/community-benefits-of-trees.jpg')" }}
        />
        <div className="absolute top-20 left-10 w-72 h-72 blob-shape nature-blob opacity-30" />
        <div className="absolute bottom-10 right-10 w-64 h-64 blob-shape earth-blob opacity-30" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="section-title mb-4">
              Tu Compra Mueve una Cadena de Impacto
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
              Cada árbol activa un ciclo que beneficia al planeta y a las comunidades locales.
            </motion.p>
          </motion.div>

          {/* Circulo Virtuoso - Horizontal */}
          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="relative max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
              {/* Step 1 */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <div className="bg-emerald-500 rounded-xl p-3 md:p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-28 md:w-32">
                  <div className="text-2xl md:text-3xl mb-1">🌱</div>
                  <h4 className="font-display text-xs md:text-sm font-bold">Tu plantas</h4>
                </div>
              </motion.div>

              {/* Arrow 1 */}
              <svg className="w-8 h-6 md:w-12 md:h-8 text-gray-400" viewBox="0 0 48 32" fill="none">
                <path d="M4 16 L36 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 10 L36 16 L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Step 2 */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <div className="bg-amber-500 rounded-xl p-3 md:p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-28 md:w-32">
                  <div className="text-2xl md:text-3xl mb-1">🏡</div>
                  <h4 className="font-display text-xs md:text-sm font-bold">Viveros venden</h4>
                </div>
              </motion.div>

              {/* Arrow 2 */}
              <svg className="w-8 h-6 md:w-12 md:h-8 text-gray-400" viewBox="0 0 48 32" fill="none">
                <path d="M4 16 L36 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 10 L36 16 L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Step 3 */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <div className="bg-orange-500 rounded-xl p-3 md:p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-28 md:w-32">
                  <div className="text-2xl md:text-3xl mb-1">👷</div>
                  <h4 className="font-display text-xs md:text-sm font-bold">Generas empleo</h4>
                </div>
              </motion.div>

              {/* Arrow 3 */}
              <svg className="w-8 h-6 md:w-12 md:h-8 text-gray-400" viewBox="0 0 48 32" fill="none">
                <path d="M4 16 L36 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 10 L36 16 L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Step 4 */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <div className="bg-green-600 rounded-xl p-3 md:p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-28 md:w-32">
                  <div className="text-2xl md:text-3xl mb-1">🌍</div>
                  <h4 className="font-display text-xs md:text-sm font-bold">Planeta más verde</h4>
                </div>
              </motion.div>
            </div>

            {/* Mensaje final */}
            <motion.div variants={fadeInUp} className="mt-12 text-center max-w-md mx-auto">
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Tu plantas</span> un arbol con tu nombre.
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Viveros</span> venden y generan ingresos.
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Trabajo digno</span> para familias locales.
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Planeta mas verde</span> para todos.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* COMO FUNCIONA - Simplificado con precios */}
      <section ref={howItWorksRef} className="section-padding premium-gradient relative overflow-hidden">
        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
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
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
          >
            {[
              {
                image: '/images/1.png',
                title: '1. Compra tu Árbol',
                desc: 'Elige ubicación, nombre y especie.',
                price: `Desde ${formatCurrency(15000)}`
              },
              {
                image: '/images/2.png',
                title: '2. Plantación Real',
                desc: 'Viveros locales preparan tu árbol. Plantadores profesionales lo plantan. Recibirás fotos del proceso.'
              },
              {
                image: '/images/3.png',
                title: '3. Tu Árbol, Tu Legado',
                desc: 'Chapa QR instalada junto al árbol. Certificado digital descargable. Visitálo cuando quieras.'
              }
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
                    <h3 className="font-display text-xl font-semibold text-gray-800 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3 flex-1">{step.desc}</p>
                    {step.price && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{step.price}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center"
          >
            <Button
              onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
              size="lg"
              className="btn-primary group text-lg px-10"
            >
              <TreePine className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              Comenzar Ahora
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Top Companies Section */}
        <section ref={topCompaniesRef} className="section-padding bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl" />

          <div className="container-wide relative z-10">
            <motion.div
              initial="hidden"
              animate={topCompaniesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.div variants={fadeInUp}>
                <Building2 className="h-14 w-14 mx-auto mb-4 text-emerald-600" />
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
              animate={topCompaniesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            >
              {topCompanies.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  Cargando empresas...
                </div>
              )}
              {topCompanies.map((company, index) => (
                <motion.div key={company.id} variants={fadeInUp}>
                  <Card className="h-full bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-emerald-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      {/* Ranking Badge */}
                      <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                        }`}>
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
                          <span className="font-semibold">{company.completed_projects} proyectos</span>
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
              animate={topCompaniesInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="text-center mt-10"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-4">Tu empresa tambien puede ser parte del cambio.</p>
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

      {/* CTA FINAL - Nuevo */}
      <section ref={ctaRef} className="section-padding bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <TreePine className="h-20 w-20 mx-auto mb-6 text-white/90" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Unite a la Comunidad
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100 mb-10 max-w-2xl mx-auto">
              Explorá la plataforma, conectá con otros y próximamente plantá tu propio árbol.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => window.open(`${APP_URL}/`, '_blank')}
                size="lg"
                className="bg-white hover:bg-gray-50 text-emerald-600 shadow-xl hover:shadow-2xl px-12 py-7 text-xl font-semibold"
              >
                <Users className="h-6 w-6 mr-3" />
                Entrar a la App
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingHome;

