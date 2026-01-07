import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

const ChapistasPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Ingresos por Chapa',
      description:
        'Ganá $5.000 ARS por cada chapa fabricada y entregada. Pago garantizado cuando el vivero confirma recepción.',
      color: 'purple',
    },
    {
      icon: Package,
      title: 'Trabajo en Lotes',
      description:
        'Fabricá chapas en lotes según demanda. Organizá tu producción de forma eficiente.',
      color: 'indigo',
    },
    {
      icon: Shield,
      title: 'Producto Duradero',
      description:
        'Tus chapas de acero inoxidable duran 10+ años. Un producto de calidad con tu marca.',
      color: 'violet',
    },
    {
      icon: Star,
      title: 'Mercado Garantizado',
      description:
        'Cada árbol vendido necesita una chapa. Demanda constante mientras la plataforma crece.',
      color: 'fuchsia',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Chapista',
      description:
        'Creá tu cuenta gratuita y mostrá tu capacidad de producción y zona de cobertura.',
    },
    {
      step: 2,
      title: 'Recibí Pedidos',
      description:
        'El sistema te asigna pedidos de chapas agrupados por vivero destino para optimizar envíos.',
    },
    {
      step: 3,
      title: 'Fabricá las Chapas',
      description:
        'Fabricá chapas de acero inoxidable con códigos QR únicos pre-generados por el sistema.',
    },
    {
      step: 4,
      title: 'Enviá al Vivero',
      description: 'Coordiná el envío con el vivero. Cuando confirman recepción, recibís tu pago.',
    },
  ];

  const requirements = [
    'Capacidad de fabricar chapas de acero inoxidable',
    'Equipo para grabado láser o similar para QR',
    'CUIT/CUIL para facturación',
    'Cuenta en MercadoPago para recibir pagos',
    'Capacidad de envío a viveros en tu zona',
    'Compromiso de calidad y tiempos de entrega',
  ];

  const faqs = [
    {
      question: '¿Qué especificaciones tienen las chapas?',
      answer:
        'Chapas de acero inoxidable, tamaño aproximado 10x15cm, con código QR grabado. Te proporcionamos los diseños y códigos QR a grabar.',
    },
    {
      question: '¿Cuánto gano por chapa?',
      answer:
        'El precio al usuario es $10.000 ARS por chapa. Vos recibís $5.000 ARS por cada chapa cuando el vivero confirma la recepción.',
    },
    {
      question: '¿Cómo funciona el envío?',
      answer:
        'Vos coordinás el envío con el vivero directamente. Los pedidos se agrupan por vivero para optimizar costos de envío.',
    },
    {
      question: '¿Cuándo recibo el pago?',
      answer:
        'El pago se libera automáticamente cuando el vivero confirma la recepción de las chapas en el sistema.',
    },
    {
      question: '¿Tiene costo registrarse?',
      answer:
        'No, el registro es 100% gratuito. Solo necesitás cumplir los requisitos de equipamiento y calidad.',
    },
  ];

  const pioneerBenefits = [
    {
      icon: Award,
      title: 'Mercado Exclusivo',
      description: 'Pocos chapistas por zona. Menos competencia significa más pedidos para vos.',
    },
    {
      icon: MapPin,
      title: 'Elegí tu Zona',
      description:
        'Los primeros chapistas eligen las zonas donde quieren operar y los viveros a abastecer.',
    },
    {
      icon: Users,
      title: 'Relación Directa',
      description: 'Construí relaciones con viveros de tu zona. Clientes recurrentes garantizados.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="bg-purple-100 dark:bg-purple-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="inline-block bg-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Buscamos Chapistas en Córdoba
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 dark:text-purple-400 mb-4">
              Sé Chapista
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Fabricá las chapas QR que identifican cada árbol plantado. Un producto duradero con
              demanda garantizada y pagos por trabajo completado.
            </p>
          </motion.div>

          {/* CTA Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
              onClick={() => window.open(`${APP_URL}/registro/chapista`, '_blank')}
            >
              <Tag className="h-5 w-5 mr-2" />
              Pre-registrarme como Chapista
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-500 dark:hover:bg-purple-900/30 px-8 py-6 text-lg"
            >
              <Link to="/contacto">Más información</Link>
            </Button>
          </motion.div>

          {/* Propuesta de valor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$5.000</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Por chapa</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Lotes</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Trabajo eficiente</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Auto</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pago automático</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Gratis</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Registro sin costo</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3 text-center">
              ¿Por qué ser Chapista?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Un negocio rentable con demanda garantizada
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const bgColors = {
                  purple: 'bg-purple-100 dark:bg-purple-900/50',
                  indigo: 'bg-indigo-100 dark:bg-indigo-900/50',
                  violet: 'bg-violet-100 dark:bg-violet-900/50',
                  fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/50',
                };
                const iconColors = {
                  purple: 'text-purple-600 dark:text-purple-400',
                  indigo: 'text-indigo-600 dark:text-indigo-400',
                  violet: 'text-violet-600 dark:text-violet-400',
                  fuchsia: 'text-fuchsia-600 dark:text-fuchsia-400',
                };
                return (
                  <Card
                    key={index}
                    className="border-purple-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${bgColors[benefit.color]}`}
                      >
                        <Icon className={`h-7 w-7 ${iconColors[benefit.color]}`} />
                      </div>
                      <CardTitle className="text-purple-800 dark:text-purple-400 text-lg">
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3 text-center">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              En 4 simples pasos empezás a fabricar y ganar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-purple-100 dark:border-gray-700 h-full">
                    <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-purple-300 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ¿Por qué unirte ahora? */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3 text-center">
              ¿Por qué unirte ahora?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Ventajas exclusivas para los primeros chapistas
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pioneerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="border-purple-200 dark:border-gray-700 dark:bg-gray-800 text-center"
                  >
                    <CardContent className="p-6">
                      <div className="bg-purple-100 dark:bg-purple-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-bold text-purple-800 dark:text-purple-400 text-lg mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-10 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-6 max-w-2xl mx-auto text-center border border-purple-200 dark:border-purple-800">
              <p className="text-purple-800 dark:text-purple-400 font-medium">
                Buscamos 1-2 chapistas por zona. Registrate ahora para asegurar tu lugar en Córdoba.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* El proceso de fabricación */}
      <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3 text-center">
              El proceso de fabricación
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Chapas de calidad con códigos QR únicos
            </p>

            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <QrCode className="h-8 w-8 mb-3 text-purple-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Códigos QR</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    El sistema genera códigos únicos (ARB-001, ARB-002...) que vos grabás en las
                    chapas
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Wrench className="h-8 w-8 mb-3 text-purple-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Fabricación</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    Acero inoxidable anti-oxidación. Grabado láser del QR para máxima durabilidad
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Truck className="h-8 w-8 mb-3 text-purple-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Envío a Vivero</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    Coordinás el envío con el vivero. Pedidos agrupados para optimizar costos
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <DollarSign className="h-8 w-8 mb-3 text-purple-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Cobro</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    Vivero confirma recepción → pago automático de $5.000 por chapa a tu cuenta
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3 text-center">
              Requisitos para ser Chapista
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Todo lo que necesitás para empezar
            </p>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto border border-purple-100 dark:border-gray-700">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3 text-center">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-purple-200 dark:border-gray-700 dark:bg-gray-800"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-800 dark:text-purple-400 text-base">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white text-center"
          >
            <Tag className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              ¿Tenés capacidad de fabricación?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-purple-100">
              Registrate ahora y asegurá tu lugar como chapista en Córdoba
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-purple-600"
                onClick={() => window.open(`${APP_URL}/registro/chapista`, '_blank')}
              >
                <Tag className="h-5 w-5 mr-2" />
                Quiero ser Chapista
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                <Link to="/contacto">Tengo más preguntas</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChapistasPage;
