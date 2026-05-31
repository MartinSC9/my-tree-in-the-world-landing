import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Tag,
  QrCode,
  Package,
  Truck,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Shield,
  Users,
  Award,
  MapPin,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className = '', id }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const ChapistasPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Ingresos por Chapa',
      description:
        'Gana $5.000 ARS por cada chapa fabricada y entregada. Pago garantizado cuando el vivero confirma recepcion.',
      color: 'purple',
    },
    {
      icon: Package,
      title: 'Trabajo en Lotes',
      description:
        'Fabrica chapas en lotes segun demanda. Organiza tu produccion de forma eficiente.',
      color: 'indigo',
    },
    {
      icon: Shield,
      title: 'Producto Duradero',
      description:
        'Tus chapas de acero inoxidable duran 10+ anos. Un producto de calidad con tu marca.',
      color: 'violet',
    },
    {
      icon: Star,
      title: 'Mercado Garantizado',
      description:
        'Cada arbol vendido necesita una chapa. Demanda constante mientras la plataforma crece.',
      color: 'fuchsia',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Chapista',
      description:
        'Crea tu cuenta gratuita y mostra tu capacidad de produccion y zona de cobertura.',
    },
    {
      step: 2,
      title: 'Recibi Pedidos',
      description:
        'El sistema te asigna pedidos de chapas agrupados por vivero destino para optimizar envios.',
    },
    {
      step: 3,
      title: 'Fabrica las Chapas',
      description:
        'Fabrica chapas de acero inoxidable con codigos QR unicos pre-generados por el sistema.',
    },
    {
      step: 4,
      title: 'Envia al Vivero',
      description: 'Coordina el envio con el vivero. Cuando confirman recepcion, recibis tu pago.',
    },
  ];

  const requirements = [
    'Capacidad de fabricar chapas de acero inoxidable',
    'Equipo para grabado laser o similar para QR',
    'CUIT/CUIL para facturacion',
    'Cuenta en MercadoPago para recibir pagos',
    'Capacidad de envio a viveros en tu zona',
    'Compromiso de calidad y tiempos de entrega',
  ];

  const faqs = [
    {
      question: '¿Que especificaciones tienen las chapas?',
      answer:
        'Chapas de acero inoxidable, tamano aproximado 10x15cm, con codigo QR grabado. Te proporcionamos los disenos y codigos QR a grabar.',
    },
    {
      question: '¿Cuanto gano por chapa?',
      answer:
        'El precio al usuario es $10.000 ARS por chapa. Vos recibis $5.000 ARS por cada chapa cuando el vivero confirma la recepcion.',
    },
    {
      question: '¿Como funciona el envio?',
      answer:
        'Vos coordinas el envio con el vivero directamente. Los pedidos se agrupan por vivero para optimizar costos de envio.',
    },
    {
      question: '¿Cuando recibo el pago?',
      answer:
        'El pago se libera automaticamente cuando el vivero confirma la recepcion de las chapas en el sistema.',
    },
    {
      question: '¿Tiene costo registrarse?',
      answer:
        'No, el registro es 100% gratuito. Solo necesitas cumplir los requisitos de equipamiento y calidad.',
    },
  ];

  const pioneerBenefits = [
    {
      icon: Award,
      title: 'Mercado Exclusivo',
      description: 'Pocos chapistas por zona. Menos competencia significa mas pedidos para vos.',
    },
    {
      icon: MapPin,
      title: 'Elegi tu Zona',
      description:
        'Los primeros chapistas eligen las zonas donde quieren operar y los viveros a abastecer.',
    },
    {
      icon: Users,
      title: 'Relacion Directa',
      description: 'Construi relaciones con viveros de tu zona. Clientes recurrentes garantizados.',
    },
  ];

  const stats = [
    { value: '$5.000', label: 'Por chapa' },
    { value: 'Lotes', label: 'Trabajo eficiente' },
    { value: 'Auto', label: 'Pago automatico' },
    { value: 'Gratis', label: 'Registro sin costo' },
  ];

  const processCards = [
    {
      icon: QrCode,
      title: 'Codigos QR',
      description:
        'El sistema genera codigos unicos (ARB-001, ARB-002...) que vos grabas en las chapas',
    },
    {
      icon: Wrench,
      title: 'Fabricacion',
      description: 'Acero inoxidable anti-oxidacion. Grabado laser del QR para maxima durabilidad',
    },
    {
      icon: Truck,
      title: 'Envio',
      description: 'Coordinas el envio con el vivero. Pedidos agrupados para optimizar costos',
    },
    {
      icon: DollarSign,
      title: 'Cobro',
      description: 'Vivero confirma recepcion → pago automatico de $5.000 por chapa a tu cuenta',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG image */}
        <img
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-sm font-semibold px-5 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              Buscamos Chapistas en Cordoba
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Se Chapista
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Fabrica las chapas QR que identifican cada arbol plantado. Un producto duradero con
            demanda garantizada y pagos por trabajo completado.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={() => window.open(`${APP_URL}/registro/chapista`, '_blank')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <Tag className="h-5 w-5" />
              Pre-registrarme como Chapista
            </button>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            >
              Mas informacion
            </Link>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-emerald-400">{stat.value}</p>
                <p className="text-white/40 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-6 w-6 text-white/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <Section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                ¿Por que ser Chapista?
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Un negocio rentable con demanda garantizada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  custom={index}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ===== HOW IT WORKS ===== */}
      <Section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                ¿Como Funciona?
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              En 4 simples pasos empezas a fabricar y ganar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div key={index} variants={fadeUp} custom={index} className="relative">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:bg-white/[0.06] transition-all duration-500">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mb-5 text-black font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-emerald-400/30 h-6 w-6" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== PIONEER BENEFITS ===== */}
      <Section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                ¿Por que unirte ahora?
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Ventajas exclusivas para los primeros chapistas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pioneerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  custom={index}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 text-center hover:bg-white/[0.06] transition-all duration-500 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Info banner */}
          <motion.div
            variants={fadeUp}
            className="mt-12 bg-white/[0.03] backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-6 max-w-2xl mx-auto text-center"
          >
            <p className="text-emerald-400 font-medium">
              Buscamos 1-2 chapistas por zona. Registrate ahora para asegurar tu lugar en Cordoba.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* ===== PROCESS ===== */}
      <Section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                El proceso de fabricacion
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Chapas de calidad con codigos QR unicos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  custom={index}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ===== REQUIREMENTS ===== */}
      <Section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Requisitos para ser Chapista
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Todo lo que necesitas para empezar
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 md:p-10 max-w-3xl mx-auto"
          >
            <ul className="space-y-5">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/60">{req}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* ===== FAQS ===== */}
      <Section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Preguntas Frecuentes
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Resolvemos tus dudas mas comunes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                custom={index}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-500"
              >
                <h3 className="text-white font-bold mb-3">{faq.question}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== CTA FINAL ===== */}
      <Section className="relative py-32 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
              <Tag className="h-8 w-8 text-emerald-400" />
            </div>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              ¿Tenes capacidad de fabricacion?
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Registrate ahora y asegura tu lugar como chapista en Cordoba
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open(`${APP_URL}/registro/chapista`, '_blank')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <Tag className="h-5 w-5" />
              Quiero ser Chapista
            </button>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            >
              Tengo mas preguntas
            </Link>
          </motion.div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default ChapistasPage;
