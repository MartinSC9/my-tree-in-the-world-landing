import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

const ViverosPage = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Acceso a Nuevos Clientes',
      description:
        'Conectá con personas que quieren plantar árboles pero no saben dónde conseguirlos.',
      color: 'green',
    },
    {
      icon: DollarSign,
      title: 'Ingresos Adicionales',
      description:
        'Generá ventas sin esfuerzo de marketing. Nosotros traemos los clientes, vos ponés los árboles.',
      color: 'emerald',
    },
    {
      icon: BarChart3,
      title: 'Panel de Control',
      description:
        'Gestioná tu inventario, pedidos y ganancias desde un dashboard intuitivo y fácil de usar.',
      color: 'teal',
    },
    {
      icon: Shield,
      title: 'Pagos Garantizados',
      description:
        'Recibí el pago de cada árbol vendido de forma segura y puntual vía transferencia bancaria.',
      color: 'blue',
    },
  ];

  const pioneerBenefits = [
    {
      icon: Award,
      title: 'Vivero Fundador',
      description: 'Sé parte del grupo inicial de viveros que lanzarán la plataforma en Córdoba.',
    },
    {
      icon: Sparkles,
      title: 'Condiciones Especiales',
      description:
        'Los primeros viveros tendrán comisiones reducidas durante los primeros 6 meses.',
    },
    {
      icon: BadgeCheck,
      title: 'Visibilidad Destacada',
      description: 'Tu vivero aparecerá destacado como "Vivero Fundador" en la plataforma.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Vivero',
      description:
        'Creá tu cuenta gratuita y completá el perfil de tu vivero con ubicación y datos de contacto.',
    },
    {
      step: 2,
      title: 'Cargá tu Catálogo',
      description:
        'Subí las especies que tenés disponibles con fotos, precios y cantidad en stock.',
    },
    {
      step: 3,
      title: 'Recibí Pedidos',
      description:
        'Cuando un usuario compra un árbol de tu zona, te notificamos para que lo prepares.',
    },
    {
      step: 4,
      title: 'Entregá al Plantador',
      description: 'Coordiná con el plantador asignado para entregar el árbol listo para plantar.',
    },
  ];

  const requirements = [
    'Ser un vivero legalmente constituido o productor de árboles',
    'Tener stock mínimo de 50 árboles de al menos 3 especies',
    'Disponer de un lugar físico para retiro o capacidad de envío',
    'Compromiso de calidad en los ejemplares',
    'Disponibilidad para responder pedidos en 48-72 horas',
  ];

  const faqs = [
    {
      question: '¿Cuándo comienzan las operaciones?',
      answer:
        'Estamos en etapa de pre-registro. Comenzaremos operaciones en Córdoba durante el primer trimestre. Te contactaremos cuando estemos listos para activar tu vivero.',
    },
    {
      question: '¿Cuánto cuesta el pre-registro?',
      answer:
        'El pre-registro es 100% gratuito y sin compromiso. Solo cobramos una comisión cuando se concrete una venta.',
    },
    {
      question: '¿Qué comisión cobra la plataforma?',
      answer:
        'La comisión estándar será del 15% sobre el precio de venta. Los viveros fundadores tendrán condiciones especiales durante los primeros meses.',
    },
    {
      question: '¿Cómo recibo los pagos?',
      answer:
        'Los pagos se realizarán semanalmente por transferencia bancaria. Podrás ver el detalle de cada transacción en tu panel.',
    },
    {
      question: '¿Qué pasa si me pre-registro y luego no quiero participar?',
      answer:
        'No hay ningún compromiso. El pre-registro solo significa que te contactaremos cuando lancemos. Podés decidir en ese momento si querés participar.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Badge de pre-registro */}
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4" />
              Pre-registro abierto para Córdoba
            </div>

            <div className="bg-emerald-100 dark:bg-emerald-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
              Viveros
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Estamos armando la red de viveros para lanzar en Córdoba. Pre-registrate ahora y sé de
              los primeros en vender tus árboles a personas que realmente quieren plantar y cuidar
              el medio ambiente.
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
              className="bg-brand hover:bg-brand-dark text-white px-8 py-6 text-lg"
              onClick={() => window.open(`${APP_URL}/registro/vivero`, '_blank')}
            >
              <Store className="h-5 w-5 mr-2" />
              Pre-registrar mi Vivero
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500 dark:hover:bg-emerald-900/30 px-8 py-6 text-lg"
            >
              <Link to="/contacto">Tengo dudas, quiero hablar</Link>
            </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-center">
              Beneficios de Unirte
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Más que una plataforma de ventas, somos tu socio para crecer
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const bgColors = {
                  green: 'bg-green-100 dark:bg-green-900/50',
                  emerald: 'bg-emerald-100 dark:bg-emerald-900/50',
                  teal: 'bg-teal-100 dark:bg-teal-900/50',
                  blue: 'bg-blue-100 dark:bg-blue-900/50',
                };
                const iconColors = {
                  green: 'text-green-600 dark:text-green-400',
                  emerald: 'text-emerald-600 dark:text-emerald-400',
                  teal: 'text-teal-600 dark:text-teal-400',
                  blue: 'text-blue-600 dark:text-blue-400',
                };
                return (
                  <Card
                    key={index}
                    className="border-emerald-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${bgColors[benefit.color]}`}
                      >
                        <Icon className={`h-7 w-7 ${iconColors[benefit.color]}`} />
                      </div>
                      <CardTitle className="text-emerald-800 dark:text-emerald-400 text-lg">
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
      <section className="py-12 px-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-center">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              En 4 simples pasos empezás a vender tus árboles
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-emerald-100 dark:border-gray-700 h-full">
                    <div className="bg-emerald-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-emerald-300 dark:text-emerald-600 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ¿Por qué unirte ahora? - Pioneer Benefits */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-center">
              ¿Por qué unirte ahora?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Los primeros viveros tendrán ventajas exclusivas
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {pioneerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="border-amber-200 dark:border-amber-800 dark:bg-gray-800 bg-amber-50/50"
                  >
                    <CardHeader className="pb-3">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-amber-100 dark:bg-amber-900/50">
                        <Icon className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle className="text-amber-800 dark:text-amber-400 text-lg">
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

            {/* Panel de Control Preview */}
            <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-center">
              Tu Panel de Control
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Todo lo que necesitás para gestionar tu vivero en un solo lugar
            </p>

            <div className="bg-gradient-to-br from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800 rounded-2xl p-8 text-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Package className="h-8 w-8 mb-3 text-emerald-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Gestión de Inventario</h3>
                  <p className="text-emerald-100 dark:text-emerald-200 text-sm">
                    Controlá stock, precios y disponibilidad de cada especie
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Truck className="h-8 w-8 mb-3 text-emerald-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Pedidos en Tiempo Real</h3>
                  <p className="text-emerald-100 dark:text-emerald-200 text-sm">
                    Recibí notificaciones y gestioná entregas fácilmente
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <TrendingUp className="h-8 w-8 mb-3 text-emerald-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Reportes y Estadísticas</h3>
                  <p className="text-emerald-100 dark:text-emerald-200 text-sm">
                    Visualizá ventas, ingresos y tendencias de tu negocio
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-white/20 pt-6">
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-white">Córdoba</p>
                  <p className="text-emerald-200 dark:text-emerald-300 text-sm">Primera zona</p>
                </div>
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-white">$0</p>
                  <p className="text-emerald-200 dark:text-emerald-300 text-sm">
                    Costo de registro
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-white">15%</p>
                  <p className="text-emerald-200 dark:text-emerald-300 text-sm">
                    Comisión estándar
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-3xl md:text-4xl font-bold text-white">7 días</p>
                  <p className="text-emerald-200 dark:text-emerald-300 text-sm">Plazo de pago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-12 px-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-center">
              Requisitos para Unirte
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Buscamos viveros comprometidos con la calidad
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-center">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-emerald-200 dark:border-emerald-800 dark:bg-gray-800"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-emerald-800 dark:text-emerald-400 text-base">
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
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center"
          >
            <Store className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              ¿Tenés un vivero en Córdoba?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-emerald-100">
              Pre-registrate ahora y sé de los primeros viveros en vender a través de nuestra
              plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-emerald-600"
                onClick={() => window.open(`${APP_URL}/registro/vivero`, '_blank')}
              >
                <Store className="h-5 w-5 mr-2" />
                Pre-registrar mi Vivero
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                <Link to="/contacto">Tengo dudas</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ViverosPage;
