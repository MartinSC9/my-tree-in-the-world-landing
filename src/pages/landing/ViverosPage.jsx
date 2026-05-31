import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Store,
  TreePine,
  Truck,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Leaf,
  MapPin,
  DollarSign,
  Package,
  Users,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  BadgeCheck,
  ChevronDown,
} from 'lucide-react';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

const SectionWrapper = ({ children, className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ViverosPage = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Acceso a Nuevos Clientes',
      description:
        'Conecta con personas que quieren plantar arboles pero no saben donde conseguirlos.',
      color: 'green',
    },
    {
      icon: DollarSign,
      title: 'Ingresos Adicionales',
      description:
        'Genera ventas sin esfuerzo de marketing. Nosotros traemos los clientes, vos pones los arboles.',
      color: 'emerald',
    },
    {
      icon: BarChart3,
      title: 'Panel de Control',
      description:
        'Gestiona tu inventario, pedidos y ganancias desde un dashboard intuitivo y facil de usar.',
      color: 'teal',
    },
    {
      icon: Shield,
      title: 'Pagos Garantizados',
      description:
        'Recibi el pago de cada arbol vendido de forma segura y puntual via transferencia bancaria.',
      color: 'blue',
    },
  ];

  const pioneerBenefits = [
    {
      icon: Award,
      title: 'Vivero Fundador',
      description: 'Se parte del grupo inicial de viveros que lanzaran la plataforma en Cordoba.',
    },
    {
      icon: Sparkles,
      title: 'Condiciones Especiales',
      description:
        'Los primeros viveros tendran comisiones reducidas durante los primeros 6 meses.',
    },
    {
      icon: BadgeCheck,
      title: 'Visibilidad Destacada',
      description: 'Tu vivero aparecera destacado como "Vivero Fundador" en la plataforma.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Vivero',
      description:
        'Crea tu cuenta gratuita y completa el perfil de tu vivero con ubicacion y datos de contacto.',
    },
    {
      step: 2,
      title: 'Carga tu Catalogo',
      description:
        'Subi las especies que tenes disponibles con fotos, precios y cantidad en stock.',
    },
    {
      step: 3,
      title: 'Recibi Pedidos',
      description:
        'Cuando un usuario compra un arbol de tu zona, te notificamos para que lo prepares.',
    },
    {
      step: 4,
      title: 'Entrega al Plantador',
      description: 'Coordina con el plantador asignado para entregar el arbol listo para plantar.',
    },
  ];

  const requirements = [
    'Ser un vivero legalmente constituido o productor de arboles',
    'Tener stock minimo de 50 arboles de al menos 3 especies',
    'Disponer de un lugar fisico para retiro o capacidad de envio',
    'Compromiso de calidad en los ejemplares',
    'Disponibilidad para responder pedidos en 48-72 horas',
  ];

  const faqs = [
    {
      question: '¿Cuando comienzan las operaciones?',
      answer:
        'Estamos en etapa de pre-registro. Comenzaremos operaciones en Cordoba durante el primer trimestre. Te contactaremos cuando estemos listos para activar tu vivero.',
    },
    {
      question: '¿Cuanto cuesta el pre-registro?',
      answer:
        'El pre-registro es 100% gratuito y sin compromiso. Solo cobramos una comision cuando se concrete una venta.',
    },
    {
      question: '¿Que comision cobra la plataforma?',
      answer:
        'La comision estandar sera del 15% sobre el precio de venta. Los viveros fundadores tendran condiciones especiales durante los primeros meses.',
    },
    {
      question: '¿Como recibo los pagos?',
      answer:
        'Los pagos se realizaran semanalmente por transferencia bancaria. Podras ver el detalle de cada transaccion en tu panel.',
    },
    {
      question: '¿Que pasa si me pre-registro y luego no quiero participar?',
      answer:
        'No hay ningun compromiso. El pre-registro solo significa que te contactaremos cuando lancemos. Podes decidir en ese momento si queres participar.',
    },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-black">
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80"
          alt="Greenhouse with plants"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-300 px-5 py-2.5 rounded-full text-sm font-medium mb-8">
              <MapPin className="h-4 w-4" />
              Pre-registro abierto
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95]"
          >
            <span className="text-white">Suma tu </span>
            <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              Vivero
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Estamos armando la red de viveros para lanzar en Cordoba. Pre-registrate ahora y se de
            los primeros en vender tus arboles a personas que realmente quieren plantar y cuidar el
            medio ambiente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.open(`${APP_URL}/registro/vivero`, '_blank')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <Store className="h-5 w-5" />
              Pre-registrar mi Vivero
            </button>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:bg-white/[0.08]"
            >
              Tengo dudas, quiero hablar
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">Descubri mas</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80"
          alt="Seedling rows"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionWrapper>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 text-center">
              Beneficios de <span className="text-emerald-400">Unirte</span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto text-lg">
              Mas que una plataforma de ventas, somos tu socio para crecer
            </p>
          </SectionWrapper>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-emerald-500/10 border border-emerald-400/20 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative py-24 px-4 bg-gray-950">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionWrapper>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 text-center">
              ¿Como <span className="text-emerald-400">Funciona</span>?
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto text-lg">
              En 4 simples pasos empezas a vender tus arboles
            </p>
          </SectionWrapper>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {howItWorks.map((item, index) => (
              <motion.div key={index} variants={staggerItem} className="relative">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:bg-white/[0.06] transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mb-5 text-black font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                    <ArrowRight className="h-6 w-6 text-emerald-400/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PIONEER BENEFITS + PANEL ============ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&q=80"
          alt="Nursery garden"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionWrapper>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 text-center">
              ¿Por que <span className="text-emerald-400">unirte ahora</span>?
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto text-lg">
              Los primeros viveros tendran ventajas exclusivas
            </p>
          </SectionWrapper>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {pioneerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-amber-500/10 border border-amber-400/20 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="h-7 w-7 text-amber-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Panel de Control */}
          <SectionWrapper>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              Tu <span className="text-emerald-400">Panel de Control</span>
            </h3>
            <p className="text-white/60 text-center mb-10 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tu vivero en un solo lugar
            </p>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/[0.04] rounded-xl p-5 border border-white/[0.06] hover:bg-white/[0.07] transition-colors">
                  <Package className="h-8 w-8 mb-3 text-emerald-400" />
                  <h3 className="font-bold text-lg mb-1 text-white">Gestion de Inventario</h3>
                  <p className="text-white/60 text-sm">
                    Controla stock, precios y disponibilidad de cada especie
                  </p>
                </div>
                <div className="bg-white/[0.04] rounded-xl p-5 border border-white/[0.06] hover:bg-white/[0.07] transition-colors">
                  <Truck className="h-8 w-8 mb-3 text-emerald-400" />
                  <h3 className="font-bold text-lg mb-1 text-white">Pedidos en Tiempo Real</h3>
                  <p className="text-white/60 text-sm">
                    Recibi notificaciones y gestiona entregas facilmente
                  </p>
                </div>
                <div className="bg-white/[0.04] rounded-xl p-5 border border-white/[0.06] hover:bg-white/[0.07] transition-colors">
                  <TrendingUp className="h-8 w-8 mb-3 text-emerald-400" />
                  <h3 className="font-bold text-lg mb-1 text-white">Reportes y Estadisticas</h3>
                  <p className="text-white/60 text-sm">
                    Visualiza ventas, ingresos y tendencias de tu negocio
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-white/[0.08] pt-6">
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400">Cordoba</p>
                  <p className="text-white/40 text-sm mt-1">Primera zona</p>
                </div>
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400">$0</p>
                  <p className="text-white/40 text-sm mt-1">Costo de registro</p>
                </div>
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400">15%</p>
                  <p className="text-white/40 text-sm mt-1">Comision estandar</p>
                </div>
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400">7 dias</p>
                  <p className="text-white/40 text-sm mt-1">Plazo de pago</p>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* ============ REQUIREMENTS ============ */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <SectionWrapper>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 text-center">
              Requisitos para <span className="text-emerald-400">Unirte</span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto text-lg">
              Buscamos viveros comprometidos con la calidad
            </p>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 max-w-3xl mx-auto">
              <ul className="space-y-5">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/60 leading-relaxed">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* ============ FAQS ============ */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <SectionWrapper>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 text-center">
              Preguntas <span className="text-emerald-400">Frecuentes</span>
            </h2>
            <p className="text-white/60 text-center mb-14 max-w-2xl mx-auto text-lg">
              Resolvemos tus dudas mas comunes
            </p>
          </SectionWrapper>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300"
              >
                <h3 className="text-white font-semibold text-base mb-3">{faq.question}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
          alt="Green field aerial view"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <SectionWrapper>
            <Store className="h-12 w-12 mx-auto mb-6 text-emerald-400" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              ¿Tenes un vivero en Cordoba?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Pre-registrate ahora y se de los primeros viveros en vender a traves de nuestra
              plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open(`${APP_URL}/registro/vivero`, '_blank')}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                <Store className="h-5 w-5" />
                Pre-registrar mi Vivero
              </button>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:bg-white/[0.08]"
              >
                Tengo dudas
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ViverosPage;
