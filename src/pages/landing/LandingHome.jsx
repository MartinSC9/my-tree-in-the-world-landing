import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  TreePine,
  Globe,
  Leaf,
  ArrowRight,
  ChevronDown,
  QrCode,
  Shield,
  FileText,
  MapPin,
  Users,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { statsService } from '@features/trees/services';
import Footer from '@shared/components/layout/Footer';
import Navbar from '@shared/components/layout/Navbar';
import OriginalHeroSection from './sections/HeroSectionV2';
import { APP_URL } from '@core/config/app.config';

// Carousel images (must import for Vite)
import carousel1 from '@/assets/images/carousel/1.png';
import carousel2 from '@/assets/images/carousel/2.png';
import carousel3 from '@/assets/images/carousel/3.png';
import carousel4 from '@/assets/images/carousel/4.png';
import carousel5 from '@/assets/images/carousel/5.png';
import carousel6 from '@/assets/images/carousel/6.png';
import carousel7 from '@/assets/images/carousel/7.png';
import carousel8 from '@/assets/images/carousel/8.png';
import carousel9 from '@/assets/images/carousel/9.png';
const carouselImgs = [
  carousel1,
  carousel2,
  carousel3,
  carousel4,
  carousel5,
  carousel6,
  carousel7,
  carousel8,
  carousel9,
];

// --- Images from Unsplash ---
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  aerial:
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1920&q=80',
  seedling:
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
  forest:
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  hands:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  qrTree:
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
  community:
    'https://images.unsplash.com/photo-1559827291-baf1b903951a?auto=format&fit=crop&w=1920&q=80',
  canopy:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80',
  impact:
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1920&q=80',
  referrals:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  collab:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  qrScan:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
};

// Mock data
const MOCK_STATS = {
  totalTrees: 148,
  plantedTrees: 95,
  totalCountries: 3,
  collaborativeTrees: 12,
};

// Animated counter
const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration, inView]);

  return <span ref={ref}>{count}</span>;
};

// Reveal text animation
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

// Parallax image
const ParallaxImage = ({ src, alt, speed = 0.3, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-[120%] object-cover" />
    </div>
  );
};

// Floating particles
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0, 0.6, 0],
          scale: [0, 1.5, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

// ============ SECTIONS ============

// 2. IMPACT NUMBERS - Cinematic stats
const ImpactSection = React.forwardRef(({ stats }, forwardedRef) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const items = [
    { value: stats.totalTrees, label: 'Arboles\ncomprados', suffix: '' },
    { value: stats.plantedTrees, label: 'Ya\nplantados', suffix: '' },
    { value: stats.totalCountries, label: 'Paises\nalcanzados', suffix: '' },
    { value: stats.collaborativeTrees || 0, label: 'Arboles\ncolaborativos', suffix: '' },
  ];

  return (
    <section
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className="relative py-32 md:py-40 bg-black overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={IMAGES.impact} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/85" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <RevealText className="mb-20">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
            Impacto real
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            Cada numero es un arbol <span className="text-emerald-400">real</span> en la tierra.
          </h2>
        </RevealText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center md:text-left"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 tabular-nums">
                <Counter value={item.value} />
                {item.suffix}
              </div>
              <p className="text-white/40 text-sm uppercase tracking-wider whitespace-pre-line leading-relaxed">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// 3. HOW IT WORKS - Cinematic steps
const ProcessSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Elegi tu arbol',
      desc: 'Selecciona la ubicacion en el mapa, ponele un nombre y elegi la especie nativa.',
      image: IMAGES.seedling,
    },
    {
      num: '02',
      title: 'Lo plantamos por vos',
      desc: 'Viveros preparan tu arbol, chapistas fabrican tu placa QR. Plantadores profesionales lo plantan.',
      image: IMAGES.hands,
    },
    {
      num: '03',
      title: 'Tu legado, para siempre',
      desc: 'Chapa de acero con QR instalada. Escanea y accede a tu pagina unica. Certificado digital incluido.',
      image: IMAGES.forest,
    },
  ];

  return (
    <section className="relative bg-black">
      {/* Section header */}
      <div className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <RevealText>
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
            Asi funciona
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            De tu pantalla al suelo, <span className="text-white/40">en 3 pasos.</span>
          </h2>
        </RevealText>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <StepBlock key={i} step={step} index={i} reverse={i % 2 !== 0} />
      ))}
    </section>
  );
};

const StepBlock = ({ step, index, reverse }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="relative">
      {/* Full-width image with overlay */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
        </motion.div>
        <div
          className={`absolute inset-0 bg-gradient-to-${reverse ? 'l' : 'r'} from-black via-black/70 to-transparent`}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div
            className={`max-w-7xl mx-auto px-6 w-full flex ${reverse ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div
              initial={{ opacity: 0, x: reverse ? 60 : -60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-lg"
            >
              <span className="text-emerald-400 text-7xl md:text-8xl font-bold opacity-30 block mb-4 leading-none">
                {step.num}
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-white/60 text-lg leading-relaxed">{step.desc}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. IDENTITY - Each tree is unique
const IdentitySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Shield,
      title: 'Chapa Fisica con QR',
      items: [
        'Acero inoxidable',
        'Durabilidad 10+ anos',
        'Tu nombre y mensaje',
        'Instalada junto al arbol',
      ],
    },
    {
      icon: Globe,
      title: 'Pagina Web Unica',
      items: [
        'Foto real de tu arbol',
        'Ubicacion GPS exacta',
        'Especie y fecha',
        'Info del plantador',
      ],
    },
    {
      icon: FileText,
      title: 'Certificado Digital',
      items: [
        'Coordenadas GPS',
        'Descargable en PDF',
        'Compartible en redes',
        'Verificable con QR',
      ],
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMAGES.qrTree} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 py-32 md:py-40 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-8"
          >
            <QrCode className="h-10 w-10 text-emerald-400" />
          </motion.div>

          <RevealText>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Cada arbol tiene su propia{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
                identidad
              </span>
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Cuando plantas con nosotros, tu arbol recibe una identidad unica y verificable.
            </p>
          </RevealText>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-500"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-5">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/50 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. FREE OPTIONS - Plant for free
const FreeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const options = [
    {
      icon: Users,
      title: 'Invita 5 amigos',
      desc: 'Comparti tu codigo. Cuando 5 amigos se unan y planten, recibis un arbol gratis.',
      highlight: false,
      image: IMAGES.referrals,
    },
    {
      icon: Heart,
      title: 'Arbol colaborativo',
      desc: 'Crea un proyecto y compartilo. Tus amigos y familia aportan hasta completar la meta.',
      highlight: true,
      image: IMAGES.collab,
    },
    {
      icon: QrCode,
      title: 'Escanea y participa',
      desc: 'Productos de empresas partner incluyen codigos QR. Escanea para sorteos de arboles.',
      highlight: false,
      image: IMAGES.qrScan,
    },
  ];

  return (
    <section ref={ref} className="relative py-32 md:py-40 bg-black overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <Particles />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <RevealText className="mb-20">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
            Sin costo
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            Planta gratis, <span className="text-white/40">de tres maneras.</span>
          </h2>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                opt.highlight
                  ? 'border-emerald-500/30 hover:border-emerald-400/50'
                  : 'border-white/[0.06] hover:border-white/10'
              }`}
            >
              {/* Card image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={opt.image}
                  alt={opt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 ${
                    opt.highlight
                      ? 'bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent'
                      : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
                  }`}
                />
                <div
                  className={`absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center ${
                    opt.highlight
                      ? 'bg-emerald-500/30 backdrop-blur-sm'
                      : 'bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <opt.icon
                    className={`h-5 w-5 ${opt.highlight ? 'text-emerald-300' : 'text-white/70'}`}
                  />
                </div>
              </div>
              {/* Card content */}
              <div className={`p-6 ${opt.highlight ? 'bg-emerald-500/[0.06]' : 'bg-white/[0.02]'}`}>
                <h3 className="text-xl font-bold text-white mb-3">{opt.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{opt.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. MISSION - Cinematic split
const MissionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* Image side */}
        <div className="relative h-[50vh] lg:h-auto overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <img src={IMAGES.canopy} alt="" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black" />
        </div>

        {/* Content side */}
        <div className="bg-black flex items-center py-20 lg:py-0">
          <div className="px-8 md:px-16 lg:px-20 max-w-xl">
            <RevealText>
              <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-6">
                Nuestra mision
              </p>
            </RevealText>

            <RevealText delay={0.15}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                Conectar a personas con la naturaleza a traves de la tecnologia.
              </h2>
            </RevealText>

            <RevealText delay={0.3}>
              <p className="text-white/50 text-lg leading-relaxed mb-10">
                Democratizamos el acceso a la reforestacion, permitiendo que cada individuo
                contribuya activamente a la regeneracion del medio ambiente. Un arbol a la vez.
              </p>
            </RevealText>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="border-l-2 border-emerald-500/40 pl-6 py-2"
            >
              <p className="text-white/30 italic text-sm leading-relaxed">
                "Ser la plataforma lider en America Latina para la plantacion colaborativa de
                arboles, logrando plantar un millon de arboles."
              </p>
              <p className="text-emerald-400/60 text-xs mt-3 uppercase tracking-wider">Vision</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 7. CAROUSEL - App screenshots
const AppCarousel = ({ APP_URL }) => {
  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background community image */}
      <div className="absolute inset-0">
        <img src={IMAGES.community} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/90" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <RevealText>
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
            La experiencia
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
            Una app social <span className="text-white/40">para el planeta.</span>
          </h2>
        </RevealText>
      </div>

      {/* Carousel */}
      <div className="relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-5 py-4"
            animate={{ x: [0, -2880] }}
            transition={{
              x: { repeat: Infinity, repeatType: 'loop', duration: 50, ease: 'linear' },
            }}
          >
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {carouselImgs.map((img, i) => (
                  <div key={`${setIndex}-${i}`} className="flex-shrink-0">
                    <div className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/50 hover:border-emerald-500/20 transition-colors duration-500">
                      <img
                        src={img}
                        alt={`App screenshot ${i + 1}`}
                        className="w-56 md:w-64 h-auto object-cover"
                      />
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <button
            onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white font-medium transition-all duration-300"
          >
            Explorar la app
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// 8. FINAL CTA - Dramatic close
const FinalCTA = ({ APP_URL }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMAGES.aerial} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Particles />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Sparkles className="h-10 w-10 text-emerald-400 mx-auto mb-8" />

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Empeza ahora.
          </h2>
          <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto">
            Explora la plataforma, conecta con otros y planta tu propio arbol. Tu legado comienza
            con un click.
          </p>

          <button
            onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
            className="group relative px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
          >
            <span className="flex items-center justify-center gap-3">
              Explorar la plataforma
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// ============ MAIN COMPONENT ============

const fetchWithRetry = async (fn) => {
  try {
    return await fn();
  } catch {
    try {
      return await fn();
    } catch {
      return null;
    }
  }
};

const MOCK_TREES = [
  {
    id: 'mock-1',
    latitude: -31.4135,
    longitude: -64.1811,
    status: 'plantado',
    species: 'Lapacho Rosado',
  },
  {
    id: 'mock-2',
    latitude: -31.428,
    longitude: -64.195,
    status: 'verificado',
    species: 'Aguaribay',
  },
  {
    id: 'mock-3',
    latitude: -31.405,
    longitude: -64.21,
    status: 'en_proceso',
    species: 'Algarrobo',
  },
  { id: 'mock-4', latitude: -31.439, longitude: -64.17, status: 'plantado', species: 'Jacaranda' },
  { id: 'mock-5', latitude: -31.42, longitude: -64.205, status: 'plantado', species: 'Tipa' },
  { id: 'mock-6', latitude: -31.41, longitude: -64.16, status: 'verificado', species: 'Ceibo' },
  {
    id: 'mock-7',
    latitude: -31.435,
    longitude: -64.188,
    status: 'plantado',
    species: 'Quebracho Blanco',
  },
  { id: 'mock-8', latitude: -31.445, longitude: -64.2, status: 'en_proceso', species: 'Espinillo' },
];

const LandingHomeV2 = () => {
  const { trees, loadTrees } = useTree();
  const { user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const [landingStats, setLandingStats] = useState(MOCK_STATS);
  const [treesLoaded, setTreesLoaded] = useState(false);

  // Refs for original hero
  const heroRef = useRef(null);
  const impactRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await fetchWithRetry(() => statsService.getLandingStats());
      if (data) setLandingStats(data);
    };
    const fetchTrees = async () => {
      await loadTrees();
      setTreesLoaded(true);
    };
    fetchStats();
    fetchTrees();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, getRedirectPath, navigate]);

  const displayTrees = treesLoaded && trees.length > 0 ? trees : !treesLoaded ? MOCK_TREES : trees;

  return (
    <div className="bg-black min-h-screen dark">
      <Navbar />
      <OriginalHeroSection
        heroRef={heroRef}
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        APP_URL={APP_URL}
        carouselRef={impactRef}
        trees={displayTrees}
        totalTrees={landingStats.totalTrees}
      />
      <ImpactSection stats={landingStats} ref={impactRef} />
      <ProcessSection />
      <IdentitySection />
      <FreeSection />
      <MissionSection />
      <AppCarousel APP_URL={APP_URL} />
      <FinalCTA APP_URL={APP_URL} />
      <Footer />
    </div>
  );
};

export default LandingHomeV2;
