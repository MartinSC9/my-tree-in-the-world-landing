import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Eye,
  Shield,
  Heart,
  Link2,
  Lightbulb,
  Sprout,
  Users,
  CheckCircle2,
  Camera,
  Bell,
  MapPin,
  BadgeCheck,
  TrendingUp,
  Linkedin,
  ArrowRight,
} from 'lucide-react';
import heroBackground from '@/assets/images/login-background.jpeg';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';

const IMAGES = {
  mission:
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
  vision:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80',
  values:
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
  commitment:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80',
};

// Reveal text animation
const RevealText = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Animated section wrapper
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'Transparencia',
      description:
        'Mostramos en tiempo real el estado de cada arbol plantado, desde el vivero hasta su ubicacion final. Cada usuario puede seguir el ciclo completo de su arbol con informacion verificable.',
    },
    {
      icon: Target,
      title: 'Impacto Real',
      description:
        'No somos una plataforma de arboles virtuales: cada arbol que se planta en nuestra app corresponde a un arbol fisico plantado por un profesional, en un lugar real, con coordenadas GPS verificables.',
    },
    {
      icon: Heart,
      title: 'Accesibilidad',
      description:
        'Creemos que cuidar el planeta debe estar al alcance de todos. Nuestra plataforma elimina las barreras geograficas y economicas para que cualquier persona pueda contribuir a la reforestacion.',
    },
    {
      icon: Link2,
      title: 'Colaboracion',
      description:
        'Conectamos usuarios, empresas, viveros y plantadores en un ecosistema donde cada rol es esencial. El trabajo en equipo multiplica nuestro impacto ambiental.',
    },
    {
      icon: Lightbulb,
      title: 'Innovacion con Proposito',
      description:
        'Utilizamos la tecnologia como herramienta para resolver problemas ambientales reales. Cada funcionalidad que desarrollamos tiene como objetivo facilitar y amplificar el impacto positivo.',
    },
    {
      icon: Sprout,
      title: 'Responsabilidad Ambiental',
      description:
        'Nos comprometemos con practicas sostenibles en toda nuestra operacion. Seleccionamos especies nativas, respetamos los ecosistemas locales y priorizamos la biodiversidad.',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description:
        'Fomentamos una comunidad activa de personas comprometidas con el medio ambiente, donde cada arbol plantado es un lazo que une a quienes comparten el deseo de un planeta mas verde.',
    },
  ];

  const commitments = [
    { icon: Camera, text: 'Verificar cada arbol plantado con fotografias y ubicacion GPS' },
    { icon: Bell, text: 'Informar periodicamente sobre el estado de los arboles' },
    { icon: MapPin, text: 'Seleccionar especies apropiadas para cada region' },
    { icon: BadgeCheck, text: 'Trabajar con viveros y plantadores locales certificados' },
    {
      icon: TrendingUp,
      text: 'Reinvertir en la mejora continua de nuestra plataforma y operaciones',
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* ===== HERO - Quienes Somos ===== */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBackground} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
              Sobre nosotros
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Quienes Somos
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Dos jovenes de Cordoba, Argentina, usando tecnologia como herramienta real de cambio.
            </p>
          </motion.div>

          {/* Team cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Nahuel Carballo',
                role: 'Fundador & Hardware/Sistemas',
                photo: '/images/nahuel.jpg',
                bio: 'Tecnico electronico y estudiante de Ingenieria en Sistemas (UTN). Experiencia en analisis de hardware, produccion industrial y desarrollo de software. La vision de campo y la conexion con el mundo fisico.',
                linkedin: 'https://www.linkedin.com/in/nahuel-carballo-a59408265',
                delay: 0.3,
              },
              {
                name: 'Martin Contrera',
                role: 'Co-fundador & Desarrollador',
                photo: '/images/martin.png',
                bio: 'Desarrollador de software con +4 anos en produccion. Especializado en IoT, IA y automatizaciones. Diseno y construyo toda la arquitectura de la plataforma — desde el backend hasta la app movil.',
                linkedin: 'https://www.linkedin.com/in/martincontrera',
                delay: 0.45,
              },
            ].map((person) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: person.delay }}
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-500"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500" />
                <div className="relative z-10 p-8 text-center">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-28 h-28 rounded-full object-cover mx-auto mb-5 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  />
                  <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                  <p className="text-emerald-400 text-sm mb-4">{person.role}</p>
                  <p className="text-white/40 text-sm leading-relaxed mb-5">{person.bio}</p>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mt-12 text-white/40 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            En 2025 transformamos una idea en realidad: una plataforma con trazabilidad real,
            coordenadas GPS y seguimiento. La tecnologia tiene que tocar la tierra, ayudar a los
            viveros, conectar personas y regenerar ecosistemas.
          </motion.p>
        </div>
      </section>

      {/* ===== MISION & VISION - Split cinematic ===== */}
      <section className="relative">
        {/* Mision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <div className="relative h-[40vh] lg:h-auto overflow-hidden">
            <motion.img
              src={IMAGES.mission}
              alt=""
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black" />
          </div>
          <div className="bg-black flex items-center py-16 lg:py-0">
            <div className="px-8 md:px-16 lg:px-20 max-w-xl">
              <AnimatedSection>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
                  <Target className="h-8 w-8 text-emerald-400" />
                </div>
              </AnimatedSection>
              <RevealText>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  Nuestra{' '}
                  <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    Mision
                  </span>
                </h2>
              </RevealText>
              <RevealText delay={0.15}>
                <p className="text-white/50 text-lg leading-relaxed">
                  Conectar a personas y empresas con la naturaleza a traves de una plataforma
                  tecnologica que facilita la plantacion de arboles reales, democratizando el acceso
                  a la reforestacion y permitiendo que cada individuo contribuya activamente a la
                  regeneracion del medio ambiente desde cualquier lugar del mundo.
                </p>
              </RevealText>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <div className="bg-black flex items-center py-16 lg:py-0 order-2 lg:order-1">
            <div className="px-8 md:px-16 lg:px-20 max-w-xl lg:ml-auto">
              <AnimatedSection>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
                  <Eye className="h-8 w-8 text-emerald-400" />
                </div>
              </AnimatedSection>
              <RevealText>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  Nuestra{' '}
                  <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                    Vision
                  </span>
                </h2>
              </RevealText>
              <RevealText delay={0.15}>
                <p className="text-white/50 text-lg leading-relaxed">
                  Ser la plataforma lider en America Latina para la plantacion colaborativa de
                  arboles, creando un movimiento global donde cada persona pueda ver el impacto
                  tangible de su contribucion ambiental, logrando plantar un millon de arboles y
                  estableciendo un nuevo estandar en la conexion entre tecnologia y sostenibilidad.
                </p>
              </RevealText>
            </div>
          </div>
          <div className="relative h-[40vh] lg:h-auto overflow-hidden order-1 lg:order-2">
            <motion.img
              src={IMAGES.vision}
              alt=""
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black" />
          </div>
        </div>
      </section>

      {/* ===== VALORES ===== */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={IMAGES.values} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <RevealText>
              <p className="text-emerald-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
                Principios
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Nuestros Valores
              </h2>
            </RevealText>
            <RevealText delay={0.15}>
              <p className="text-xl text-white/40 max-w-2xl mx-auto">
                Los principios que guian cada decision que tomamos
              </p>
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={index * 0.08}>
                <div className="group h-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                    <value.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPROMISO ===== */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={IMAGES.commitment} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedSection>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-8"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </motion.div>
            </AnimatedSection>
            <RevealText>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Nuestro Compromiso
              </h2>
            </RevealText>
            <RevealText delay={0.15}>
              <p className="text-lg text-white/40">En Mi Arbol en el Mundo nos comprometemos a:</p>
            </RevealText>
          </div>

          <div className="space-y-4">
            {commitments.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="flex items-center gap-5 p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl hover:bg-white/[0.06] hover:border-emerald-500/15 transition-all duration-500 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                    <item.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-white/70 text-lg font-medium group-hover:text-white/90 transition-colors">
                    {item.text}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection delay={0.5} className="text-center mt-16">
            <button
              onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
            >
              Planta tu arbol
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
