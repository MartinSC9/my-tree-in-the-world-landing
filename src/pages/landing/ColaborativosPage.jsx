import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
import { collaborativeService } from '@features/trees/services';
import { formatCurrency, calculateFundingPercentage } from '@/utils/currencyUtils';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

// Video de fondo (Mixkit - licencia libre, sin atribucion)
const HERO_VIDEO_URL = 'https://assets.mixkit.co/videos/50847/50847-1080.mp4';

// Unsplash images for cinematic sections
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80',
  steps: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1920&q=80',
  cta: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
};

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

// Reveal text animation (slides up from below with overflow-hidden)
const RevealText = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Barra de progreso
const FundingBar = ({ percentage }) => (
  <div className="w-full h-2.5 rounded-full overflow-hidden bg-white/[0.08]">
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

// Card de proyecto - dark glassmorphism
const ProjectCard = ({ project, index }) => {
  const percentage =
    project.funding_percentage ??
    calculateFundingPercentage(project.current_amount, project.target_amount);
  const isCompleted = project.status === 'completed' || percentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group rounded-2xl overflow-hidden border transition-all duration-500 bg-white/[0.03] backdrop-blur-xl border-white/[0.08] hover:bg-white/[0.06] hover:border-emerald-500/30 hover:-translate-y-1"
    >
      {/* Header con especie y estado */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate text-white">{project.tree_name}</h3>
            <p className="text-sm text-emerald-400">{project.tree_species}</p>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isCompleted
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
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
        <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-white/50">
          {project.description || 'Proyecto colaborativo para plantar un arbol entre todos.'}
        </p>

        {/* Info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="flex items-center gap-1.5 text-white/40">
            <Users className="h-3.5 w-3.5" />
            {project.total_contributors || 0}{' '}
            {(project.total_contributors || 0) === 1 ? 'persona' : 'personas'}
          </span>
          {project.city && (
            <span className="flex items-center gap-1.5 text-white/40">
              <Globe className="h-3.5 w-3.5" />
              {project.city}
            </span>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-white">
              {formatCurrency(project.current_amount || 0)}
            </span>
            <span className="text-xs text-white/30">
              de {formatCurrency(project.target_amount)}
            </span>
          </div>
          <FundingBar percentage={percentage} />
          <div className="flex items-center justify-between mt-1.5">
            <span
              className={`text-xs font-medium ${
                isCompleted ? 'text-emerald-400' : 'text-white/40'
              }`}
            >
              {Math.round(percentage)}% financiado
            </span>
            <span className="text-xs text-white/30">por {project.creator_name || 'Anonimo'}</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      {!isCompleted && (
        <div className="px-6 pb-5">
          <Button
            onClick={() => window.open(`${APP_URL}/arboles-colaborativos/${project.id}`, '_blank')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-0 transition-colors duration-300"
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

// Section wrapper with scroll-triggered stagger
const StaggerSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const fadeChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const ColaborativosPage = () => {
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
    <div className="min-h-screen bg-black">
      <FloatingLoader visible={!loaded} />

      {/* ============================================================
          HERO — Full viewport, video + Unsplash poster + dark overlay
          ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Unsplash poster (fallback / background) */}
        <img
          src={IMAGES.hero}
          alt="Manos plantando juntas"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />

        {/* Video on top of poster */}
        <div className="absolute inset-0 z-[1]">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={IMAGES.hero}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        </div>

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/70 via-black/60 to-black" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <StaggerSection>
            <motion.div variants={fadeChild} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-full px-5 py-2.5 text-sm font-medium text-white/80">
                <Heart className="h-4 w-4 text-pink-400" />
                Plantacion colaborativa
              </span>
            </motion.div>

            <motion.div variants={fadeChild}>
              <RevealText className="mb-2">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
                  Un arbol,
                </h1>
              </RevealText>
              <RevealText delay={0.15} className="mb-8">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                  muchas manos
                </h1>
              </RevealText>
            </motion.div>

            <motion.div variants={fadeChild}>
              <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                Unite a proyectos de plantacion creados por la comunidad. Aporta lo que puedas y ve
                crecer un arbol real, financiado entre todos.
              </p>
            </motion.div>

            <motion.div
              variants={fadeChild}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos`, '_blank')}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg px-8 group border-0 shadow-lg shadow-emerald-500/20 transition-all duration-300"
              >
                <Heart className="h-5 w-5 mr-2" />
                Explorar proyectos
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos/crear`, '_blank')}
                size="lg"
                variant="outline"
                className="border-white/[0.15] bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/[0.25] text-white text-lg px-8 transition-all duration-300"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Crear un proyecto
              </Button>
            </motion.div>
          </StaggerSection>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20 flex flex-col items-center cursor-pointer"
            onClick={() =>
              document.getElementById('que-son')?.scrollIntoView({ behavior: 'smooth' })
            }
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3">
              Conoce mas
            </span>
            <ChevronDown className="h-5 w-5 text-white/30" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          QUE SON — Background image + dark overlay + glass step cards
          ============================================================ */}
      <section id="que-son" className="relative py-28 px-4 overflow-hidden">
        {/* Background image */}
        <img
          src={IMAGES.steps}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <StaggerSection className="text-center mb-20">
            <motion.div variants={fadeChild}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-emerald-500/10 border border-emerald-500/20">
                <Users className="h-8 w-8 text-emerald-400" />
              </div>
            </motion.div>
            <motion.div variants={fadeChild}>
              <RevealText>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                  Que son los arboles colaborativos?
                </h2>
              </RevealText>
            </motion.div>
            <motion.div variants={fadeChild}>
              <p className="text-lg max-w-3xl mx-auto leading-relaxed text-white/50">
                Son proyectos de plantacion donde varias personas juntan fondos para plantar un
                arbol real. Vos elegis cuanto aportar, y cuando se completa la meta, el arbol se
                planta con ubicacion GPS, chapa QR y seguimiento en vivo. Cada contribuyente recibe
                su certificado digital.
              </p>
            </motion.div>
          </StaggerSection>

          {/* Como funciona - Steps */}
          <StaggerSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeChild}
                className="relative text-center p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-500"
              >
                {/* Number watermark */}
                <div className="absolute -top-3 -left-1 text-7xl font-bold leading-none text-white/[0.04] select-none">
                  {i + 1}
                </div>
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-emerald-500/10 border border-emerald-500/20">
                  <step.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">{step.desc}</p>
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ============================================================
          PROYECTOS — Dark bg, glassmorphism project cards
          ============================================================ */}
      <section className="py-28 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <StaggerSection className="text-center mb-16">
            <motion.div variants={fadeChild}>
              <RevealText>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight">
                  Proyectos de la comunidad
                </h2>
              </RevealText>
            </motion.div>
            <motion.div variants={fadeChild}>
              <p className="text-lg text-white/40">
                Encontra un proyecto que te inspire y suma tu aporte
              </p>
            </motion.div>
          </StaggerSection>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((p) => p.status === 'active' || p.status === 'completed')
                .map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
              <TreePine className="h-12 w-12 mx-auto mb-4 text-white/20" />
              <p className="text-lg font-medium mb-2 text-white/40">
                No hay proyectos activos en este momento
              </p>
              <p className="text-sm text-white/25">Se el primero en crear uno!</p>
            </div>
          )}

          {/* Ver todos CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => window.open(`${APP_URL}/arboles-colaborativos`, '_blank')}
              variant="outline"
              size="lg"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300"
            >
              Ver todos los proyectos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL — Unsplash aerial forest bg + dark overlay
          ============================================================ */}
      <section className="relative py-28 px-4 overflow-hidden">
        {/* Background image */}
        <img
          src={IMAGES.cta}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <StaggerSection>
            <motion.div variants={fadeChild}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8">
                <Heart className="h-8 w-8 text-pink-400" />
              </div>
            </motion.div>

            <motion.div variants={fadeChild}>
              <RevealText>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
                  Cada aporte suma
                </h2>
              </RevealText>
            </motion.div>

            <motion.div variants={fadeChild}>
              <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
                No importa el monto. Cuando muchos aportan un poco, un arbol real crece en algun
                rincon del mundo con tu nombre grabado.
              </p>
            </motion.div>

            <motion.div
              variants={fadeChild}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos`, '_blank')}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg px-8 border-0 shadow-lg shadow-emerald-500/20 transition-all duration-300"
              >
                <HeartHandshake className="h-5 w-5 mr-2" />
                Contribuir ahora
              </Button>
              <Button
                onClick={() => window.open(`${APP_URL}/arboles-colaborativos/crear`, '_blank')}
                size="lg"
                variant="outline"
                className="border-white/[0.15] bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/[0.25] text-white text-lg px-8 transition-all duration-300"
              >
                Crear mi proyecto
              </Button>
            </motion.div>
          </StaggerSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColaborativosPage;
