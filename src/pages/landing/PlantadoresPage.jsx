import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Shovel,
  TreePine,
  MapPin,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Leaf,
  DollarSign,
  Sun,
  Heart,
  Users,
  Camera,
  Award,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

/* ------------------------------------------------------------------ */
/*  Reusable animation wrapper                                        */
/* ------------------------------------------------------------------ */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
const PlantadoresPage = () => {
  /* ---- data arrays (unchanged) ---- */
  const benefits = [
    {
      icon: DollarSign,
      title: 'Ingresos Flexibles',
      description:
        'Ganá dinero plantando árboles en tu tiempo libre. Vos elegís cuándo y dónde trabajar.',
      color: 'amber',
    },
    {
      icon: Heart,
      title: 'Impacto Real',
      description:
        'Cada árbol que plantás contribuye a un planeta más verde. Tu trabajo tiene significado.',
      color: 'rose',
    },
    {
      icon: Sun,
      title: 'Trabajo al Aire Libre',
      description: 'Dejá la oficina atrás. Trabajá en contacto con la naturaleza y el aire libre.',
      color: 'orange',
    },
    {
      icon: Star,
      title: 'Construí tu Reputación',
      description:
        'Recibí calificaciones de usuarios y destacate como plantador experto en tu zona.',
      color: 'yellow',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Plantador',
      description:
        'Creá tu cuenta gratuita y completá tu perfil con tu zona de trabajo y disponibilidad.',
    },
    {
      step: 2,
      title: 'Recibí Asignaciones',
      description:
        'Cuando hay un árbol para plantar en tu zona, te notificamos con todos los detalles.',
    },
    {
      step: 3,
      title: 'Retirá el Árbol',
      description: 'Coordiná con el vivero asignado para retirar el árbol listo para plantar.',
    },
    {
      step: 4,
      title: 'Plantá y Documentá',
      description: 'Plantá el árbol en la ubicación indicada y subí fotos del proceso. ¡Listo!',
    },
  ];

  const requirements = [
    'Ser mayor de 18 años',
    'Tener conocimientos básicos de jardinería o horticultura',
    'Contar con herramientas básicas (pala, regadera, guantes)',
    'Disponer de movilidad propia para traslados',
    'Smartphone con cámara para documentar plantaciones',
    'Disponibilidad mínima de 4 horas semanales',
  ];

  const faqs = [
    {
      question: '¿Cuándo empiezo a recibir asignaciones?',
      answer:
        'Estamos en etapa de pre-registro. Te notificaremos cuando lancemos en tu zona y comenzarás a recibir asignaciones según tu disponibilidad.',
    },
    {
      question: '¿Cuánto voy a ganar por árbol?',
      answer:
        'El pago varía según ubicación y tipo de árbol. Estimamos entre $5.000 y $15.000 ARS por plantación, con pago garantizado en 48hs.',
    },
    {
      question: '¿Necesito experiencia previa?',
      answer:
        'No es obligatorio, pero valoramos conocimientos de jardinería. Ofreceremos guías y capacitación para asegurar plantaciones exitosas.',
    },
    {
      question: '¿Puedo rechazar asignaciones?',
      answer:
        'Sí, tendrás control total de tu agenda. Podrás aceptar o rechazar trabajos según tu disponibilidad y zona.',
    },
    {
      question: '¿Tiene costo registrarse?',
      answer:
        'No, el registro es 100% gratuito. Solo necesitás cumplir los requisitos básicos y completar tu perfil.',
    },
  ];

  const pioneerBenefits = [
    {
      icon: Award,
      title: 'Sé de los Primeros',
      description:
        'Formá parte del grupo fundador de plantadores y construí tu reputación desde el inicio.',
    },
    {
      icon: MapPin,
      title: 'Elegí tu Zona',
      description:
        'Los primeros plantadores tienen prioridad para elegir las zonas donde quieren trabajar.',
    },
    {
      icon: Users,
      title: 'Comunidad Fundadora',
      description:
        'Participá en las decisiones y ayudanos a mejorar la plataforma con tu feedback.',
    },
  ];

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ============================================================ */}
      {/*  1. HERO — full viewport                                     */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* bg image */}
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
          alt="Campo verde"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-400 text-sm font-semibold px-5 py-1.5 rounded-full mb-6 tracking-wide">
              Próximo lanzamiento
            </span>
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              Sé Plantador
            </span>
          </motion.h1>

          {/* subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Estamos armando nuestra red de plantadores en Córdoba. Registrate ahora para ser de los
            primeros y ganá dinero mientras ayudás a reforestar el planeta.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={() => window.open(`${APP_URL}/registro/plantador`, '_blank')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              <Shovel className="h-5 w-5" />
              Pre-registrarme como Plantador
            </button>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/[0.06] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors backdrop-blur-sm"
            >
              Más información
            </Link>
          </motion.div>

          {/* 4 stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: 'Córdoba', label: 'Primera zona' },
              { value: '100%', label: 'Trabajo flexible' },
              { value: '48hs', label: 'Pago garantizado' },
              { value: 'Gratis', label: 'Registro sin costo' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 text-center"
              >
                <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
                <p className="text-white/40 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-6 w-6 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  2. BENEFITS — Unsplash bg + overlay                         */}
      {/* ============================================================ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
          alt="Golden field at sunrise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                ¿Por qué ser Plantador?
              </span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto">
              Más que un trabajo, una forma de vida conectada con la naturaleza
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:border-emerald-400/30 transition-colors group">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-emerald-500/10 border border-emerald-400/20">
                      <Icon className="h-7 w-7 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. HOW IT WORKS — dark bg, connecting arrows                */}
      {/* ============================================================ */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                ¿Cómo Funciona?
              </span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto">
              En 4 simples pasos empezás a plantar y ganar
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Reveal key={index} delay={index * 0.12}>
                <div className="relative h-full">
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:border-emerald-400/30 transition-colors">
                    <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-black font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-emerald-400/40 h-6 w-6" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. PIONEER BENEFITS — dark bg, 3 centered cards             */}
      {/* ============================================================ */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                ¿Por qué unirte ahora?
              </span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto">
              Ventajas exclusivas para los primeros plantadores
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pioneerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 text-center h-full hover:border-emerald-400/30 transition-colors group">
                    <div className="bg-emerald-500/10 border border-emerald-400/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Icon className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.35}>
            <div className="mt-12 bg-white/[0.03] backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-6 max-w-2xl mx-auto text-center">
              <p className="text-white/60">
                Estamos en etapa de pre-registro. Cuando lancemos en tu zona, serás de los primeros
                en recibir asignaciones.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. PROCESS — Unsplash bg + overlay, 4 Paso cards            */}
      {/* ============================================================ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=1920&q=80"
          alt="Hands holding seedling"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                El proceso de plantación
              </span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto">
              Vos elegís cuándo hacerlo, solo necesitás luz del día para las fotos
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: 'Paso 1',
                text: 'Revisás las notificaciones y aceptás una asignación cerca de tu zona',
              },
              {
                icon: TreePine,
                title: 'Paso 2',
                text: 'Retirás el árbol del vivero asignado con todas las instrucciones',
              },
              {
                icon: Shovel,
                title: 'Paso 3',
                text: 'Llegás a la ubicación, preparás el terreno y plantás el árbol',
              },
              {
                icon: Camera,
                title: 'Paso 4',
                text: 'Documentás con fotos durante el día, subís el reporte y recibís tu pago en 48hs',
              },
            ].map((paso, index) => {
              const Icon = paso.icon;
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:border-emerald-400/30 transition-colors">
                    <Icon className="h-8 w-8 mb-4 text-emerald-400" />
                    <h3 className="font-bold text-lg mb-2 text-white">{paso.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{paso.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. REQUIREMENTS — dark bg, glass card with checklist        */}
      {/* ============================================================ */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                Requisitos para ser Plantador
              </span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto">
              Todo lo que necesitás para empezar
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 md:p-10 max-w-3xl mx-auto">
              <ul className="space-y-5">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/60">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. FAQs — dark bg, 2-column glass cards                     */}
      {/* ============================================================ */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                Preguntas Frecuentes
              </span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:border-emerald-400/30 transition-colors">
                  <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  8. FINAL CTA — Unsplash bg + dark overlay                   */}
      {/* ============================================================ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80"
          alt="Aerial green valley"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            <Shovel className="h-12 w-12 mx-auto mb-6 text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                ¿Querés ser de los primeros?
              </span>
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
              Registrate ahora y asegurá tu lugar como plantador fundador en Córdoba
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open(`${APP_URL}/registro/plantador`, '_blank')}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-colors"
              >
                <Shovel className="h-5 w-5" />
                Quiero ser Plantador Fundador
              </button>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/[0.06] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors backdrop-blur-sm"
              >
                Tengo más preguntas
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlantadoresPage;
