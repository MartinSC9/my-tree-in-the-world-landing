import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { TreePine, Globe, Users, Award, Leaf, Building2, Heart, QrCode, Microscope, Shield, Droplets, Sprout, CheckCircle, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { statsService } from '@features/trees/services';
import Footer from '@shared/components/layout/Footer';

// URL de la app (para login/registro)
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5174';

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

  // Estado para las estadísticas de landing (endpoint ligero)
  const [landingStats, setLandingStats] = useState({
    totalTrees: 0,
    plantedTrees: 0,
    totalCountries: 0,
    totalCompanies: 0
  });

  // Cargar stats ligeras al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getLandingStats();
        setLandingStats(data);
      } catch (error) {
        console.error('Error cargando stats:', error);
      }
    };
    fetchStats();
    // También cargar árboles para la sección de "Recent Trees"
    loadTrees();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role, user.id);
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, getRedirectPath, navigate]);

  const stats = [
    { icon: TreePine, label: 'Arboles Comprados', value: landingStats.totalTrees, color: 'hsl(152 68% 38%)', bgColor: 'hsl(152 68% 92%)' },
    { icon: Leaf, label: 'Ya Plantados', value: landingStats.plantedTrees, color: 'hsl(165 60% 40%)', bgColor: 'hsl(165 60% 90%)' },
    { icon: Globe, label: 'Paises', value: landingStats.totalCountries, color: 'hsl(200 85% 45%)', bgColor: 'hsl(200 85% 92%)' }
  ];

  // Section refs for scroll animations
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const environmentRef = useRef(null);
  const howItWorksRef = useRef(null);
  const collaborativeRef = useRef(null);
  const recentTreesRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const environmentInView = useInView(environmentRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const collaborativeInView = useInView(collaborativeRef, { once: true, margin: "-100px" });
  const recentTreesInView = useInView(recentTreesRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://img.freepik.com/fotos-premium/plantar-arboles-crecer-suelo-sobre-fondo-verde_44622-1057.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, hsl(152 68% 50% / 0.15) 0%, transparent 70%)`,
                left: `${10 + i * 20}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="badge-nature inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 border-white/20 text-white">
                <Sparkles className="w-4 h-4" />
                Reforestacion con Impacto Real
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight tracking-tight"
            >
              Mi Arbol en el{' '}
              <span className="relative inline-block">
                <span className="text-gradient bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  Mundo
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-green-100/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Ayudamos a reforestar el planeta gracias al compromiso de personas como vos.
              <span className="block mt-3 text-white font-medium">
                Cada arbol que compras se planta realmente.
              </span>
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="btn-primary group text-lg px-10 rounded-xl w-[280px] h-[68px] justify-center items-center"
              >
                <TreePine className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                Comenzar Ahora
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                asChild
                size="lg"
                className="glass-effect hover:bg-white/20 text-white px-10 text-lg rounded-xl border-white/30 w-[280px] h-[68px] justify-center items-center"
              >
                <Link to="/mapa" className="flex items-center justify-center w-[280px] h-[68px]">
                  <Globe className="h-6 w-6 mr-3" />
                  Ver Mapa Global
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 right-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-padding relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 blob-shape nature-blob" />
        <div className="absolute bottom-0 left-0 w-80 h-80 blob-shape earth-blob" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
                  <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="section-padding nature-gradient relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Heart className="h-16 w-16 mx-auto mb-6 text-white/90 floating" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title text-white mb-6">
              Nuestra Mision
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100/90 max-w-4xl mx-auto leading-relaxed">
              En "Mi Arbol en el Mundo" ayudamos a reforestar el planeta gracias al compromiso de personas como vos.
              Cada vez que alguien compra un arbol en nuestra plataforma, se planta un arbol real en el lugar elegido.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="glass-dark rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <QrCode className="h-16 w-16 mx-auto text-emerald-300 mb-4 breathe" />
              <h3 className="font-display text-3xl font-semibold text-white mb-4">
                Cada Arbol Tiene su Propia Identidad Digital
              </h3>
              <p className="text-green-200 text-lg max-w-3xl mx-auto">
                Tu arbol recibe un codigo QR unico instalado en una chapa de acero inoxidable anti-oxidacion
              </p>
            </div>

            {/* QR Trail Image */}
            <div className="flex justify-center mb-10">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md group">
                <img
                  src="https://preview.redd.it/the-walking-trail-around-the-park-i-visited-has-signs-v0-8uo37xifrl4b1.jpg?width=640&crop=smart&auto=webp&s=3aff62b51923974ec61020621a9f0f4cde7c058b"
                  alt="Ejemplo de cartel QR instalado en sendero"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-sm text-center font-medium">
                    Asi lucen nuestros carteles QR instalados junto a cada arbol
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Physical Tag */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4 mb-5">
                  <div className="bg-emerald-400/20 p-4 rounded-xl">
                    <Shield className="h-7 w-7 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Chapa Resistente</h4>
                    <p className="text-green-200/80 text-sm">Acero inoxidable anti-oxidacion</p>
                  </div>
                </div>
                <ul className="space-y-3 text-green-100">
                  {[
                    'Durabilidad de 10+ anos en exteriores',
                    'Nombre personalizado grabado con laser',
                    'Resistente a lluvia, sol y temperaturas',
                    'Instalada en poste junto al arbol'
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
                <div className="flex items-start gap-4 mb-5">
                  <div className="bg-emerald-400/20 p-4 rounded-xl">
                    <Globe className="h-7 w-7 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Pagina Web Unica</h4>
                    <p className="text-green-200/80 text-sm">Al escanear el QR, se abre:</p>
                  </div>
                </div>
                <ul className="space-y-3 text-green-100">
                  {[
                    'Nombre y foto de tu arbol',
                    'Ubicacion exacta en mapa con GPS',
                    'Todos los participantes (arboles colaborativos)',
                    'Especie, vivero y plantador',
                    'Impacto ambiental (CO2, agua filtrada)'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Example Preview */}
            <div className="certificate-border rounded-2xl">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6">
                <p className="text-white font-semibold text-center mb-4">Ejemplo de lo que veran al escanear tu QR:</p>
                <div className="bg-white rounded-xl p-6 space-y-4 shadow-lg">
                  <div className="text-center">
                    <span className="text-5xl">🌳</span>
                  </div>
                  <p className="text-emerald-700 font-display text-2xl text-center font-semibold">
                    "Jacaranda de la Abuela Maria"
                  </p>
                  <p className="text-gray-600 text-center text-sm italic">
                    Este arbol fue plantado gracias a Martin Lopez
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-gray-200">
                    {[
                      { icon: '📍', label: 'Ubicacion', value: 'Plaza San Martin' },
                      { icon: '🌱', label: 'Especie', value: 'Jacaranda mimosifolia' },
                      { icon: '📅', label: 'Plantado', value: '15 Enero 2025' },
                      { icon: '🌍', label: 'CO2 Absorbido', value: '21.77 kg/ano' },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <p className="text-2xl mb-1">{item.icon}</p>
                        <p className="font-semibold text-emerald-600 text-xs uppercase tracking-wide">{item.label}</p>
                        <p className="text-gray-700 font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Environmental Commitment Section */}
      <section ref={environmentRef} className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 blob-shape nature-blob opacity-30" />
        <div className="absolute bottom-10 right-10 w-64 h-64 blob-shape earth-blob opacity-30" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={environmentInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Microscope className="h-16 w-16 mx-auto mb-6 text-[hsl(152,68%,38%)] floating-slow" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title mb-6">
              Plantamos con Conciencia Ambiental
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
              Cada arbol es seleccionado cuidadosamente por botanicos y especialistas en ecologia
              para que sea el adecuado para la zona.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={environmentInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* What we DON'T do */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full premium-card bg-gradient-to-br from-red-50 to-orange-50 border-red-200/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                      <Droplets className="h-7 w-7 text-red-500" />
                    </div>
                    <CardTitle className="text-red-800 font-display text-2xl">Lo que NO hacemos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-red-700">
                    {[
                      'Evitamos plantar especies que consumen mucha agua en zonas secas',
                      'No introducimos arboles urbanos en ecosistemas naturales delicados',
                      'No plantamos cualquier arbol en cualquier lado'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-red-400 font-bold text-lg">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Our Commitment */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full premium-card bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <Shield className="h-7 w-7 text-emerald-600" />
                    </div>
                    <CardTitle className="text-emerald-800 font-display text-2xl">Nuestro Compromiso</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center pt-4">
                  <Leaf className="h-20 w-20 text-emerald-500 mb-6 leaf-sway" />
                  <p className="text-emerald-700 text-lg font-medium leading-relaxed">
                    Nuestro compromiso es con el planeta y la biodiversidad.
                    Cada decision se toma pensando en el equilibrio ecologico.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={howItWorksRef} className="section-padding premium-gradient relative overflow-hidden">
        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="section-title mb-6">
              ¿Cómo Funciona?
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mx-auto mb-10">
              Unete a nuestra comunidad global de reforestadores y obten increibles beneficios mientras ayudas al planeta
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="glass-effect rounded-2xl p-6 max-w-3xl mx-auto"
            >
              <p className="text-[hsl(200,85%,35%)] font-medium text-lg">
                <strong>Todos son bienvenidos!</strong> Puedes crear tu cuenta gratuita y ser parte de nuestra comunidad
                incluso sin comprar arboles.
              </p>
            </motion.div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20"
          >
            {[
              {
                icon: TreePine,
                color: 'hsl(152 68% 38%)',
                bg: 'hsl(152 68% 92%)',
                title: '1. Compra tu Arbol',
                desc: 'Elige tu pais, dale un nombre a tu arbol y realiza la compra. Un arbol real sera plantado por nuestros especialistas.'
              },
              {
                icon: Globe,
                color: 'hsl(200 85% 45%)',
                bg: 'hsl(200 85% 92%)',
                title: '2. Plantacion Real',
                desc: 'Nuestros especialistas plantan tu arbol en el lugar elegido con un codigo QR unico para su seguimiento.'
              },
              {
                icon: Award,
                color: 'hsl(45 95% 45%)',
                bg: 'hsl(45 95% 90%)',
                title: '3. Seguimiento y Certificado',
                desc: 'Tu arbol aparece en el mapa mundial y recibes tu certificado digital personalizado con coordenadas GPS.'
              }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ background: step.bg }}
                >
                  <step.icon className="h-10 w-10" style={{ color: step.color }} />
                </div>
                <div className="premium-card rounded-2xl p-6">
                  <h3 className="font-display text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="glass-effect rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <h3 className="font-display text-3xl font-semibold text-gray-800 mb-4">Beneficios de Nuestra Comunidad</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Desde el momento que te registras, formas parte de nuestra familia ecologica.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8 border border-blue-200/50">
              <h4 className="font-display text-2xl font-semibold text-blue-800 mb-6 text-center">
                Beneficios Gratuitos para Todos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Globe, title: 'Mapa Global', desc: 'Explora todos los arboles plantados' },
                  { icon: Users, title: 'Red Social', desc: 'Conecta con otros eco-warriors' },
                  { icon: Leaf, title: 'Contenido Educativo', desc: 'Aprende sobre sostenibilidad' },
                  { icon: Heart, title: 'Impacto Global', desc: 'Sigue el progreso mundial' },
                ].map((benefit, i) => (
                  <div key={i} className="premium-card bg-white rounded-xl p-5 text-center">
                    <benefit.icon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <h5 className="font-semibold text-blue-800 mb-1">{benefit.title}</h5>
                    <p className="text-xs text-blue-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                  size="lg"
                  className="btn-primary bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Unete Gratis Ahora!
                </Button>
                <Button
                  onClick={() => window.open(`${APP_URL}/login`, '_blank')}
                  size="lg"
                  className="btn-secondary"
                >
                  <TreePine className="h-5 w-5 mr-2" />
                  Ya Tengo Cuenta
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaborative Trees Section */}
      <section ref={collaborativeRef} className="section-padding bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Users className="h-16 w-16 mx-auto mb-6 text-purple-600 floating" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title text-purple-900 mb-6">
              Arboles Colaborativos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-purple-700 max-w-4xl mx-auto">
              Unite con amigos, familia o comunidades para plantar arboles juntos.
              <span className="block mt-2 font-semibold">Es como una "vaquita" digital para reforestar el planeta.</span>
            </motion.p>
          </motion.div>

          {/* How Collaborative Works */}
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="premium-card bg-white rounded-3xl p-8 md:p-12 mb-12"
          >
            <h3 className="font-display text-2xl font-semibold text-purple-800 mb-10 text-center">¿Cómo Funciona?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: '1', title: 'Crea o Unite', desc: 'Crea tu proyecto o unite a uno existente' },
                { num: '2', title: 'Aporta', desc: 'Cada persona aporta para uno o varios arboles' },
                { num: '3', title: 'Completa la Meta', desc: 'Entre todos llegan al objetivo' },
                { num: '4', title: 'Se Plantan!', desc: 'Los arboles se plantan y todos reciben certificado' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-purple-700">{step.num}</span>
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Two Types */}
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* User Projects */}
            <motion.div variants={fadeInUp}>
              <Card className="premium-card h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-blue-800">Proyectos de Usuarios</CardTitle>
                      <p className="text-blue-600 text-sm">Amigos, familia, comunidades</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Proyectos Personales', desc: 'Crea tu propio proyecto (max 1 activo)' },
                    { title: 'Certificado Colaborativo', desc: 'Todos aparecen en el certificado' },
                    { title: 'Aportes Flexibles', desc: 'Desde $100 ARS por persona' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-800">{item.title}</p>
                        <p className="text-sm text-blue-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-blue-100/50 rounded-xl p-4 mt-4">
                    <p className="text-sm font-medium text-blue-800 mb-2">💡 Ejemplos:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Cumpleanos del abuelo: toda la familia planta juntos</li>
                      <li>• Proyecto escolar: una clase reforesta su comunidad</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Projects */}
            <motion.div variants={fadeInUp}>
              <Card className="premium-card h-full bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-orange-800">Proyectos de Empresas</CardTitle>
                      <p className="text-orange-600 text-sm">Marketing + RSE + Engagement</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Proyectos Ilimitados', desc: 'Multiples proyectos simultaneos' },
                    { title: 'Sorteo de Cupones', desc: 'Descuentos del 10% al 50%' },
                    { title: 'Empresa Aporta Primero', desc: 'Minimo 30% inicial' },
                    { title: 'Mas Aportas, Mas Chances', desc: 'Cada $1 ARS = 1 ticket' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-800">{item.title}</p>
                        <p className="text-sm text-orange-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-orange-100/50 rounded-xl p-4 mt-4">
                    <p className="text-sm font-medium text-orange-800 mb-2">🏆 Beneficios empresariales:</p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Marketing positivo con impacto real</li>
                      <li>• Fidelizacion mediante cupones</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative z-10">
                <h3 className="font-display text-3xl font-semibold mb-4">¿Listos para plantar juntos?</h3>
                <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
                  Unite a proyectos existentes o crea el tuyo propio. Juntos podemos hacer mas por el planeta.
                </p>
                <Button
                  onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-purple-600 shadow-xl hover:shadow-2xl px-10 py-6"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Explorar Proyectos Colaborativos
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Trees Section */}
      {trees.length > 0 && (
        <section ref={recentTreesRef} className="section-padding bg-white/80">
          <div className="container-wide">
            <motion.div
              initial="hidden"
              animate={recentTreesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="section-title mb-4">
                Arboles Recientes
              </motion.h2>
              <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
                Conoce a las personas que estan haciendo la diferencia
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={recentTreesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {trees.slice(-6).reverse().map((tree, index) => (
                <motion.div key={tree.id} variants={fadeInUp}>
                  <Card className="premium-card bg-white/90 backdrop-blur-sm hover:shadow-xl">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <TreePine className="h-6 w-6 text-emerald-600" />
                        </div>
                        {tree.isPhysical && (
                          <span className="badge-nature text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Fisico
                          </span>
                        )}

                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-display font-semibold text-lg text-gray-800 mb-1">{tree.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {tree.country}
                      </div>
                      <p className="text-xs text-gray-500">
                        Plantado por: {tree.email}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={recentTreesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center mt-10"
            >
              <Button asChild className="btn-secondary">
                <Link to="/mapa">
                  <Globe className="h-5 w-5 mr-2" />
                  Ver Todos los Arboles
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingHome;
