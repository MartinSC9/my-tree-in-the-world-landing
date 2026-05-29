import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Users,
  TreePine,
  ArrowRight,
  Loader2,
  Target,
  HeartHandshake,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { useTheme } from '@core/contexts/ThemeContext';
import { collaborativeService } from '@features/trees/services';
import { formatCurrency, calculateFundingPercentage } from '@/utils/currencyUtils';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

// Video de fondo (Mixkit - licencia libre, sin atribucion)
const HERO_VIDEO_URL = 'https://assets.mixkit.co/videos/50847/50847-1080.mp4';

// Mock data mientras carga
const MOCK_PROJECTS = [
  {
    id: 'mock-1',
    tree_name: 'Lapacho del Parque Sarmiento',
    tree_species: 'Lapacho Rosado',
    description:
      'Un lapacho rosa para embellecer el ingreso del Parque Sarmiento y dar sombra a las familias.',
    target_amount: 24000,
    current_amount: 16800,
    status: 'active',
    city: 'Cordoba',
    country: 'Argentina',
    total_contributors: 7,
    creator_name: 'Maria Lopez',
    funding_percentage: 70,
    created_at: '2026-04-15',
  },
  {
    id: 'mock-2',
    tree_name: 'Aguaribay Comunitario',
    tree_species: 'Aguaribay',
    description: 'Proyecto vecinal para plantar un aguaribay nativo en la plaza del barrio.',
    target_amount: 18000,
    current_amount: 18000,
    status: 'completed',
    city: 'Villa Carlos Paz',
    country: 'Argentina',
    total_contributors: 12,
    creator_name: 'Carlos Mendez',
    funding_percentage: 100,
    created_at: '2026-03-10',
  },
  {
    id: 'mock-3',
    tree_name: 'Jacaranda Escolar',
    tree_species: 'Jacaranda',
    description: 'Los alumnos de la Escuela Normal juntan fondos para un jacaranda en el patio.',
    target_amount: 20000,
    current_amount: 5000,
    status: 'active',
    city: 'Cordoba',
    country: 'Argentina',
    total_contributors: 3,
    creator_name: 'Escuela Normal Superior',
    funding_percentage: 25,
    created_at: '2026-05-01',
  },
];

// Helper: fetch con 1 retry
const fetchWithRetry = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    try {
      return await fn();
    } catch (retryError) {
      console.error('Error tras retry:', retryError);
      return null;
    }
  }
};

// Barra de progreso
const FundingBar = ({ percentage, isDark }) => (
  <div
    className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(percentage, 100)}%` }}
      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      className={`h-full rounded-full ${
        percentage >= 100
          ? 'bg-gradient-to-r from-emerald-500 to-green-400'
          : 'bg-gradient-to-r from-emerald-600 to-teal-500'
      }`}
    />
  </div>
);

// Card de proyecto
const ProjectCard = ({ project, index, isDark }) => {
  const percentage =
    project.funding_percentage ??
    calculateFundingPercentage(project.current_amount, project.target_amount);
  const isCompleted = project.status === 'completed' || percentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isDark
          ? 'bg-gray-800/80 border-gray-700 hover:border-emerald-500/50'
          : 'bg-white border-gray-200 hover:border-emerald-400'
      }`}
    >
      {/* Header con especie y estado */}
      <div
        className={`px-6 pt-6 pb-4 ${isDark ? 'border-b border-gray-700/50' : 'border-b border-gray-100'}`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {project.tree_name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {project.tree_species}
            </p>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {isCompleted ? 'Completado' : 'Activo'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        <p
          className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {project.description || 'Proyecto colaborativo para plantar un arbol entre todos.'}
        </p>

        {/* Info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span
            className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <Users className="h-3.5 w-3.5" />
            {project.total_contributors || 0}{' '}
            {(project.total_contributors || 0) === 1 ? 'persona' : 'personas'}
          </span>
          {project.city && (
            <span
              className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              <Globe className="h-3.5 w-3.5" />
              {project.city}
            </span>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(project.current_amount || 0)}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              de {formatCurrency(project.target_amount)}
            </span>
          </div>
          <FundingBar percentage={percentage} isDark={isDark} />
          <div className="flex items-center justify-between mt-1.5">
            <span
              className={`text-xs font-medium ${
                isCompleted
                  ? isDark
                    ? 'text-emerald-400'
                    : 'text-emerald-600'
                  : isDark
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}
            >
              {Math.round(percentage)}% financiado
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              por {project.creator_name || 'Anonimo'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      {!isCompleted && (
        <div className={`px-6 pb-5`}>
          <Button
            onClick={() => window.open(`${APP_URL}/arboles-colaborativos/${project.id}`, '_blank')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            <HeartHandshake className="h-4 w-4 mr-2" />
            Contribuir
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// Loader flotante
const FloatingLoader = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="collab-loader"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 right-5 z-[100] flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg border border-white/10"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
        <span className="text-gray-300">Cargando proyectos...</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const steps = [
  {
    icon: Sparkles,
    title: 'Alguien crea un proyecto',
    desc: 'Cualquier persona o empresa elige la especie, el lugar y crea un arbol colaborativo.',
  },
  {
    icon: HeartHandshake,
    title: 'La comunidad contribuye',
    desc: 'Otros usuarios aportan al proyecto. Cada contribucion se registra con transparencia.',
  },
  {
    icon: Target,
    title: 'Se alcanza la meta',
    desc: 'Cuando se completa el financiamiento, se genera automaticamente la orden de plantacion.',
  },
  {
    icon: TreePine,
    title: 'El arbol se planta',
    desc: 'Un plantador profesional lo planta en la ubicacion elegida, con GPS y foto verificada.',
  },
];

const ColaborativosPage = () => {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await fetchWithRetry(() => collaborativeService.getCollaborativeTrees());
      if (data && data.length > 0) setProjects(data);
      setLoaded(true);
    };
    fetchProjects();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <FloatingLoader visible={!loaded} />

      {/* Hero con video */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      >
        {/* Video de fondo */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster=""
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Contenido hero */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-medium text-white">
                <Heart className="h-4 w-4 text-pink-400" />
                Plantacion colaborativa
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Un arbol,{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent">
                muchas manos
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Unite a proyectos de plantacion creados por la comunidad. Aporta lo que puedas y ve
              crecer un arbol real, financiado entre todos.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos`, '_blank')}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 group"
              >
                <Heart className="h-5 w-5 mr-2" />
                Explorar proyectos
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos/crear`, '_blank')}
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg px-8"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Crear un proyecto
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center cursor-pointer"
            onClick={() =>
              document.getElementById('que-son')?.scrollIntoView({ behavior: 'smooth' })
            }
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-white/50 text-sm mb-2">Conoce mas</span>
            <ChevronDown className="h-5 w-5 text-white/50" />
          </motion.div>
        </div>
      </section>

      {/* Que son los arboles colaborativos */}
      <section id="que-son" className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'
              }`}
            >
              <Users className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Que son los arboles colaborativos?
            </h2>
            <p
              className={`text-lg max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Son proyectos de plantacion donde varias personas juntan fondos para plantar un arbol
              real. Vos elegis cuanto aportar, y cuando se completa la meta, el arbol se planta con
              ubicacion GPS, chapa QR y seguimiento en vivo. Cada contribuyente recibe su
              certificado digital.
            </p>
          </motion.div>

          {/* Como funciona - Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative text-center p-6 rounded-2xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-emerald-50/80'
                }`}
              >
                <div
                  className={`absolute -top-3 -left-1 text-6xl font-bold leading-none ${
                    isDark ? 'text-gray-600/30' : 'text-emerald-200/60'
                  }`}
                >
                  {i + 1}
                </div>
                <div
                  className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'
                  }`}
                >
                  <step.icon
                    className={`h-6 w-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                  />
                </div>
                <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos activos */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Proyectos de la comunidad
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Encontra un proyecto que te inspire y suma tu aporte
            </p>
          </motion.div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((p) => p.status === 'active' || p.status === 'completed')
                .map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} isDark={isDark} />
                ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <TreePine
                className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
              />
              <p
                className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                No hay proyectos activos en este momento
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Se el primero en crear uno!
              </p>
            </div>
          )}

          {/* Ver todos CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Button
              onClick={() => window.open(`${APP_URL}/arboles-colaborativos`, '_blank')}
              variant="outline"
              size="lg"
              className={`${
                isDark
                  ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-900/30'
                  : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Ver todos los proyectos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
          <div className={`absolute inset-0 ${isDark ? 'bg-gray-900/85' : 'bg-emerald-900/80'}`} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-12 w-12 text-pink-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cada aporte suma</h2>
            <p className="text-lg text-gray-200 mb-8 max-w-xl mx-auto leading-relaxed">
              No importa el monto. Cuando muchos aportan un poco, un arbol real crece en algun
              rincon del mundo con tu nombre grabado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos`, '_blank')}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8"
              >
                <HeartHandshake className="h-5 w-5 mr-2" />
                Contribuir ahora
              </Button>
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos/crear`, '_blank')}
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 hover:bg-white/20 text-white text-lg px-8"
              >
                Crear mi proyecto
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColaborativosPage;
