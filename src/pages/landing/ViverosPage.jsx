import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store, TreePine, Truck, BarChart3, Shield, Clock,
  CheckCircle, ArrowRight, Leaf, MapPin, DollarSign,
  Package, Users, Star, TrendingUp
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
      description: 'Conectate con miles de personas que quieren plantar árboles pero no saben dónde conseguirlos.',
      color: 'green'
    },
    {
      icon: DollarSign,
      title: 'Ingresos Adicionales',
      description: 'Generá ventas sin esfuerzo de marketing. Nosotros traemos los clientes, vos ponés los árboles.',
      color: 'emerald'
    },
    {
      icon: BarChart3,
      title: 'Panel de Control',
      description: 'Gestioná tu inventario, pedidos y ganancias desde un dashboard intuitivo y fácil de usar.',
      color: 'teal'
    },
    {
      icon: Shield,
      title: 'Pagos Garantizados',
      description: 'Recibí el pago de cada árbol vendido de forma segura y puntual vía transferencia bancaria.',
      color: 'blue'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Vivero',
      description: 'Creá tu cuenta gratuita y completá el perfil de tu vivero con ubicación y datos de contacto.'
    },
    {
      step: 2,
      title: 'Cargá tu Catálogo',
      description: 'Subí las especies que tenés disponibles con fotos, precios y cantidad en stock.'
    },
    {
      step: 3,
      title: 'Recibí Pedidos',
      description: 'Cuando un usuario compra un árbol de tu zona, te notificamos para que lo prepares.'
    },
    {
      step: 4,
      title: 'Entregá al Plantador',
      description: 'Coordiná con el plantador asignado para entregar el árbol listo para plantar.'
    }
  ];

  const requirements = [
    'Ser un vivero legalmente constituido o productor de árboles',
    'Tener stock mínimo de 50 árboles de al menos 3 especies',
    'Disponer de un lugar físico para retiro o capacidad de envío',
    'Compromiso de calidad en los ejemplares',
    'Disponibilidad para responder pedidos en 48-72 horas'
  ];

  const faqs = [
    {
      question: '¿Cuánto cuesta registrarse?',
      answer: 'El registro es 100% gratuito. Solo cobramos una pequeña comisión por cada venta realizada a través de la plataforma.'
    },
    {
      question: '¿Qué comisión cobra la plataforma?',
      answer: 'La comisión es del 15% sobre el precio de venta. Vos definís el precio de tus árboles y eso es lo que recibís menos la comisión.'
    },
    {
      question: '¿Cómo recibo los pagos?',
      answer: 'Los pagos se realizan semanalmente por transferencia bancaria. Podés ver el detalle de cada transacción en tu panel.'
    },
    {
      question: '¿Puedo elegir qué pedidos aceptar?',
      answer: 'Sí, tenés control total. Podés pausar tu cuenta si estás sin stock o rechazar pedidos específicos.'
    },
    {
      question: '¿Qué pasa si un árbol tiene problemas?',
      answer: 'Tenemos un sistema de garantía. Si el árbol no prospera en los primeros 30 días, trabajamos juntos para reponerlo.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              Viveros
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Unite a nuestra red de viveros y vendé tus árboles a personas que realmente
              quieren plantar y cuidar el medio ambiente. Sin intermediarios, con pagos garantizados.
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
              onClick={() => window.open(`${APP_URL}/registro/vivero`, '_blank')}
            >
              <Store className="h-5 w-5 mr-2" />
              Registrar mi Vivero
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg"
            >
              <Link to="/contacto">
                Tengo dudas, quiero hablar
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 text-center">
              Beneficios de Unirte
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Más que una plataforma de ventas, somos tu socio para crecer
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-emerald-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className={`bg-${benefit.color}-100 w-14 h-14 rounded-full flex items-center justify-center mb-3`}>
                        <Icon className={`h-7 w-7 text-${benefit.color}-600`} />
                      </div>
                      <CardTitle className="text-emerald-800 text-lg">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-12 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 text-center">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              En 4 simples pasos empezás a vender tus árboles
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 h-full">
                    <div className="bg-emerald-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-emerald-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-emerald-300 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Panel de Control Preview */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 text-center">
              Tu Panel de Control
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Todo lo que necesitás para gestionar tu vivero en un solo lugar
            </p>

            <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <Package className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">Gestión de Inventario</h3>
                  <p className="text-emerald-100 text-sm">Controlá stock, precios y disponibilidad de cada especie</p>
                </div>
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <Truck className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">Pedidos en Tiempo Real</h3>
                  <p className="text-emerald-100 text-sm">Recibí notificaciones y gestioná entregas fácilmente</p>
                </div>
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">Reportes y Estadísticas</h3>
                  <p className="text-emerald-100 text-sm">Visualizá ventas, ingresos y tendencias de tu negocio</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">$0</p>
                  <p className="text-emerald-200 text-sm">Costo de registro</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">15%</p>
                  <p className="text-emerald-200 text-sm">Comisión por venta</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">7 días</p>
                  <p className="text-emerald-200 text-sm">Plazo de pago</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-emerald-200 text-sm">Soporte disponible</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-12 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 text-center">
              Requisitos para Unirte
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Buscamos viveros comprometidos con la calidad
            </p>

            <div className="bg-white rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 text-center">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-emerald-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-emerald-800 text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
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
              ¿Listo para vender tus árboles?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-emerald-100">
              Unite a la red de viveros que están ayudando a reforestar Argentina
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-emerald-600"
                onClick={() => window.open(`${APP_URL}/registro/vivero`, '_blank')}
              >
                <Store className="h-5 w-5 mr-2" />
                Registrar mi Vivero Gratis
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                <Link to="/contacto">
                  Contactar al Equipo
                </Link>
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
