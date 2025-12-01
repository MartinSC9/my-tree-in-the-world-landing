import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { TreePine, Globe, Users, Award, Leaf, Heart, QrCode, Shield, CheckCircle, ArrowRight, MapPin, TrendingUp, FileText, Building2, Trophy } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { statsService } from '@features/trees/services';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';




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

  // Estado para top colaboradores
  const [topContributors, setTopContributors] = useState([]);

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

    const fetchTopContributors = async () => {
      try {
        const contributors = await statsService.getTopContributors(6);
        setTopContributors(contributors || []);
      } catch (error) {
        console.error('Error cargando top colaboradores:', error);
      }
    };

    fetchStats();
    fetchTopCompanies();
    fetchTopContributors();
    loadTrees();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role, user.id);
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
  const collaborativeRef = useRef(null);
  const topCompaniesRef = useRef(null);
  const recentTreesRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const uniqueInView = useInView(uniqueRef, { once: true, margin: "-100px" });
  const impactInView = useInView(impactRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const collaborativeInView = useInView(collaborativeRef, { once: true, margin: "-100px" });
  const topCompaniesInView = useInView(topCompaniesRef, { once: true, margin: "-100px" });
  const recentTreesInView = useInView(recentTreesRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen">
      {/* Hero Section - SIMPLIFICADO */}
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

        {/* Hero Content - MAS DIRECTO */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight tracking-tight"
            >
              Mi Árbol en el{' '}
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
              className="text-xl md:text-2xl text-green-100/90 mb-6 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Planta un árbol real. Visitálo cuando quieras.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto"
            >
              Cada árbol tiene su propio código QR y certificado.
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

        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-padding relative overflow-hidden">
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
                  <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* QUE HACE UNICO A TU ARBOL - Nueva seccion (reemplaza Nuestra Mision) */}
      <section ref={uniqueRef} className="section-padding nature-gradient relative overflow-hidden">
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
            <motion.h2 variants={fadeInUp} className="section-title text-white mb-6">
              Cada Árbol Tiene su Propia Identidad
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
      <section ref={impactRef} className="section-padding bg-white relative overflow-hidden">
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

          {/* Circulo Virtuoso - Zigzag Compacto */}
          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="relative max-w-sm mx-auto"
          >
            <div className="flex flex-col gap-2">
              {/* Row 1 - Left */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <div className="bg-emerald-500 rounded-xl p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-36">
                  <div className="text-3xl mb-1">🌱</div>
                  <h4 className="font-display text-sm font-bold">Tu plantas</h4>
                </div>
                <svg className="w-16 h-10 text-gray-400 ml-1" viewBox="0 0 64 40" fill="none">
                  <path d="M4 4 L52 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M44 30 L52 32 L50 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              {/* Row 2 - Right */}
              <motion.div variants={fadeInUp} className="flex items-center justify-end">
                <div className="bg-amber-500 rounded-xl p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-36">
                  <div className="text-3xl mb-1">🏡</div>
                  <h4 className="font-display text-sm font-bold">Viveros venden</h4>
                </div>
              </motion.div>

              {/* Arrow down-left */}
              <motion.div variants={fadeInUp} className="flex justify-end pr-28">
                <svg className="w-16 h-10 text-gray-400" viewBox="0 0 64 40" fill="none">
                  <path d="M60 4 L12 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 30 L12 32 L14 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              {/* Row 3 - Left */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <div className="bg-orange-500 rounded-xl p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-36">
                  <div className="text-3xl mb-1">👷</div>
                  <h4 className="font-display text-sm font-bold">Generas empleo</h4>
                </div>
                <svg className="w-16 h-10 text-gray-400 ml-1" viewBox="0 0 64 40" fill="none">
                  <path d="M4 4 L52 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M44 30 L52 32 L50 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              {/* Row 4 - Right */}
              <motion.div variants={fadeInUp} className="flex items-center justify-end">
                <div className="bg-green-600 rounded-xl p-4 text-center text-white shadow-lg hover:scale-105 transition-all duration-300 w-36">
                  <div className="text-3xl mb-1">🌍</div>
                  <h4 className="font-display text-sm font-bold">Planeta más verde</h4>
                </div>
              </motion.div>
            </div>

            {/* Mensaje final */}
            <motion.div variants={fadeInUp} className="mt-8 text-center">
              <p className="text-xl text-gray-600">
                <span className="font-bold text-emerald-600">Trabajo digno</span> para familias locales.
                <span className="font-bold text-emerald-600"> Oxigeno</span> para el planeta.
                <span className="font-bold text-emerald-600"> Un árbol real</span> con tu nombre.
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
                price: 'Desde $15,000 ARS'
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
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-3">{step.desc}</p>
                    {step.price && (
                      <p className="text-emerald-600 font-bold text-lg">{step.price}</p>
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

      {/* Collaborative Trees Section - Simplificado */}
      <section ref={collaborativeRef} className="section-padding bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="container-wide relative z-10">
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp}>
              <Users className="h-16 w-16 mx-auto mb-6 text-purple-600 floating" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title text-purple-900 mb-6">
              Árboles Colaborativos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-purple-700 max-w-3xl mx-auto">
              Unite con amigos, familia o comunidades para plantar árboles juntos.
            </motion.p>
          </motion.div>

          {/* How Collaborative Works */}
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="premium-card bg-white rounded-3xl p-8 md:p-12 mb-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: '1', title: 'Crea o Unite', desc: 'Crea tu proyecto o unite a uno existente' },
                { num: '2', title: 'Aporta', desc: 'Cada persona aporta lo que pueda' },
                { num: '3', title: 'Completa la Meta', desc: 'Entre todos llegan al objetivo' },
                { num: '4', title: 'Se Plantan!', desc: 'Los arboles se plantan y todos aparecen en el certificado' },
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

          {/* CTA */}
          <motion.div
            initial="hidden"
            animate={collaborativeInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative z-10">
                <h3 className="font-display text-3xl font-semibold mb-4">¿Listos para plantar juntos?</h3>
                <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
                  Ideal para cumpleaños, proyectos escolares, o simplemente para hacer algo bueno con amigos.
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

      {/* Top Companies Section */}
        <section ref={topCompaniesRef} className="section-padding bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-100/40 blur-3xl" />

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
                <div className="col-span-full text-center py-8 text-gray-500">
                  Cargando empresas...
                </div>
              )}
              {topCompanies.map((company, index) => (
                <motion.div key={company.id} variants={fadeInUp}>
                  <Card className="h-full bg-gradient-to-br from-white to-emerald-50 border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      {/* Ranking Badge */}
                      <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {index < 3 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <span className="font-bold text-lg">#{index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Company Name */}
                      <h3 className="font-display font-bold text-lg text-gray-800 mb-3">
                        {company.company_name || company.username}
                      </h3>

                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-emerald-600">
                          <TreePine className="h-4 w-4" />
                          <span className="font-semibold">{company.completed_projects} proyectos</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          ${Number(company.total_raised).toLocaleString('es-AR')} recaudado
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
              <p className="text-gray-600 mb-4">Tu empresa también puede ser parte del cambio.</p>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                variant="outline"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Conoce el programa empresarial
              </Button>
            </motion.div>
          </div>
        </section>

      {/* Top Contributors Section */}
        <section ref={recentTreesRef} className="section-padding bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />

          <div className="container-wide relative z-10">
            <motion.div
              initial="hidden"
              animate={recentTreesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.div variants={fadeInUp}>
                <Heart className="h-14 w-14 mx-auto mb-4 text-amber-600" />
              </motion.div>
              <motion.h2 variants={fadeInUp} className="section-title text-amber-900 mb-4">
                Top Colaboradores
              </motion.h2>
              <motion.p variants={fadeInUp} className="section-subtitle text-amber-700 mx-auto">
                Las personas que más han aportado a proyectos colaborativos
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={recentTreesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {topContributors.length === 0 && (
                <div className="col-span-full text-center py-8 text-amber-600">
                  Cargando colaboradores...
                </div>
              )}
              {topContributors.map((contributor, index) => (
                <motion.div key={contributor.id} variants={fadeInUp}>
                  <Card className="h-full bg-white border-amber-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Ranking Badge */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {index < 3 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <span className="font-bold text-lg">#{index + 1}</span>
                          )}
                        </div>

                        {/* Contributor Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-lg text-gray-800 truncate">
                            {contributor.first_name && contributor.last_name
                              ? `${contributor.first_name} ${contributor.last_name}`
                              : contributor.username}
                          </h3>
                          <div className="flex items-center gap-2 text-amber-600">
                            <Heart className="h-4 w-4" />
                            <span className="font-semibold">{contributor.projects_supported} proyectos</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            ${Number(contributor.total_contributed).toLocaleString('es-AR')} aportado
                          </div>
                        </div>
                      </div>
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
              <p className="text-amber-700 mb-4">Unite a los colaboradores y apoya proyectos de reforestación</p>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Users className="h-5 w-5 mr-2" />
                Ver Proyectos Colaborativos
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
              Planta tu Primer Árbol Hoy
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100 mb-4 max-w-2xl mx-auto">
              Un árbol real. Con tu nombre. Para siempre.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-3xl font-bold text-white mb-10">
              Desde $15,000 ARS
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="bg-white hover:bg-gray-50 text-emerald-600 shadow-xl hover:shadow-2xl px-12 py-7 text-xl font-semibold"
              >
                <TreePine className="h-6 w-6 mr-3" />
                Comenzar Ahora
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
