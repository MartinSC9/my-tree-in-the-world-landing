import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shovel, TreePine, MapPin, Calendar, Star, Clock,
  CheckCircle, ArrowRight, Leaf, DollarSign, Sun,
  Heart, Users, Camera, Award, Compass
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

const PlantadoresPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Ingresos Flexibles',
      description: 'Ganá dinero plantando árboles en tu tiempo libre. Vos elegís cuándo y dónde trabajar.',
      color: 'amber'
    },
    {
      icon: Heart,
      title: 'Impacto Real',
      description: 'Cada árbol que plantás contribuye a un planeta más verde. Tu trabajo tiene significado.',
      color: 'rose'
    },
    {
      icon: Sun,
      title: 'Trabajo al Aire Libre',
      description: 'Dejá la oficina atrás. Trabajá en contacto con la naturaleza y el aire libre.',
      color: 'orange'
    },
    {
      icon: Star,
      title: 'Construí tu Reputación',
      description: 'Recibí calificaciones de usuarios y destacate como plantador experto en tu zona.',
      color: 'yellow'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Registrate como Plantador',
      description: 'Creá tu cuenta gratuita y completá tu perfil con tu zona de trabajo y disponibilidad.'
    },
    {
      step: 2,
      title: 'Recibí Asignaciones',
      description: 'Cuando hay un árbol para plantar en tu zona, te notificamos con todos los detalles.'
    },
    {
      step: 3,
      title: 'Retirá el Árbol',
      description: 'Coordiná con el vivero asignado para retirar el árbol listo para plantar.'
    },
    {
      step: 4,
      title: 'Plantá y Documentá',
      description: 'Plantá el árbol en la ubicación indicada y subí fotos del proceso. ¡Listo!'
    }
  ];

  const requirements = [
    'Ser mayor de 18 años',
    'Tener conocimientos básicos de jardinería o horticultura',
    'Contar con herramientas básicas (pala, regadera, guantes)',
    'Disponer de movilidad propia para traslados',
    'Smartphone con cámara para documentar plantaciones',
    'Disponibilidad mínima de 4 horas semanales'
  ];

  const faqs = [
    {
      question: '¿Cuándo empiezo a recibir asignaciones?',
      answer: 'Estamos en etapa de pre-registro. Te notificaremos cuando lancemos en tu zona y comenzarás a recibir asignaciones según tu disponibilidad.'
    },
    {
      question: '¿Cuánto voy a ganar por árbol?',
      answer: 'El pago varía según ubicación y tipo de árbol. Estimamos entre $5.000 y $15.000 ARS por plantación, con pago garantizado en 48hs.'
    },
    {
      question: '¿Necesito experiencia previa?',
      answer: 'No es obligatorio, pero valoramos conocimientos de jardinería. Ofreceremos guías y capacitación para asegurar plantaciones exitosas.'
    },
    {
      question: '¿Puedo rechazar asignaciones?',
      answer: 'Sí, tendrás control total de tu agenda. Podrás aceptar o rechazar trabajos según tu disponibilidad y zona.'
    },
    {
      question: '¿Tiene costo registrarse?',
      answer: 'No, el registro es 100% gratuito. Solo necesitás cumplir los requisitos básicos y completar tu perfil.'
    }
  ];

  const pioneerBenefits = [
    {
      icon: Award,
      title: 'Sé de los Primeros',
      description: 'Formá parte del grupo fundador de plantadores y construí tu reputación desde el inicio.'
    },
    {
      icon: MapPin,
      title: 'Elegí tu Zona',
      description: 'Los primeros plantadores tienen prioridad para elegir las zonas donde quieren trabajar.'
    },
    {
      icon: Users,
      title: 'Comunidad Fundadora',
      description: 'Participá en las decisiones y ayudanos a mejorar la plataforma con tu feedback.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="bg-amber-100 dark:bg-amber-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shovel className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="inline-block bg-amber-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Próximo lanzamiento en Córdoba
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 dark:text-amber-400 mb-4">
              Sé Plantador
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Estamos armando nuestra red de plantadores en Córdoba. Registrate ahora para ser
              de los primeros y ganá dinero mientras ayudás a reforestar el planeta.
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
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
              onClick={() => window.open(`${APP_URL}/registro/plantador`, '_blank')}
            >
              <Shovel className="h-5 w-5 mr-2" />
              Pre-registrarme como Plantador
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/30 px-8 py-6 text-lg"
            >
              <Link to="/contacto">
                Más información
              </Link>
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
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">Córdoba</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Primera zona</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">100%</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Trabajo flexible</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">48hs</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pago garantizado</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">Gratis</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-400 mb-3 text-center">
              ¿Por qué ser Plantador?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Más que un trabajo, una forma de vida conectada con la naturaleza
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const bgColors = {
                  amber: 'bg-amber-100 dark:bg-amber-900/50',
                  rose: 'bg-rose-100 dark:bg-rose-900/50',
                  orange: 'bg-orange-100 dark:bg-orange-900/50',
                  yellow: 'bg-yellow-100 dark:bg-yellow-900/50'
                };
                const iconColors = {
                  amber: 'text-amber-600 dark:text-amber-400',
                  rose: 'text-rose-600 dark:text-rose-400',
                  orange: 'text-orange-600 dark:text-orange-400',
                  yellow: 'text-yellow-600 dark:text-yellow-400'
                };
                return (
                  <Card key={index} className="border-amber-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${bgColors[benefit.color]}`}>
                        <Icon className={`h-7 w-7 ${iconColors[benefit.color]}`} />
                      </div>
                      <CardTitle className="text-amber-800 dark:text-amber-400 text-lg">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-12 px-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-400 mb-3 text-center">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              En 4 simples pasos empezás a plantar y ganar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-amber-100 dark:border-gray-700 h-full">
                    <div className="bg-amber-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-amber-300 h-6 w-6" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-400 mb-3 text-center">
              ¿Por qué unirte ahora?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Ventajas exclusivas para los primeros plantadores
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pioneerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-amber-200 dark:border-gray-700 dark:bg-gray-800 text-center">
                    <CardContent className="p-6">
                      <div className="bg-amber-100 dark:bg-amber-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="font-bold text-amber-800 dark:text-amber-400 text-lg mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-10 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-6 max-w-2xl mx-auto text-center border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-400 font-medium">
                Estamos en etapa de pre-registro. Cuando lancemos en tu zona, serás de los primeros en recibir asignaciones.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* El día de un plantador */}
      <section className="py-12 px-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-400 mb-3 text-center">
              El proceso de plantación
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Vos elegís cuándo hacerlo, solo necesitás luz del día para las fotos
            </p>

            <div className="bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Clock className="h-8 w-8 mb-3 text-amber-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Paso 1</h3>
                  <p className="text-amber-100 dark:text-amber-200 text-sm">Revisás las notificaciones y aceptás una asignación cerca de tu zona</p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <TreePine className="h-8 w-8 mb-3 text-amber-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Paso 2</h3>
                  <p className="text-amber-100 dark:text-amber-200 text-sm">Retirás el árbol del vivero asignado con todas las instrucciones</p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Shovel className="h-8 w-8 mb-3 text-amber-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Paso 3</h3>
                  <p className="text-amber-100 dark:text-amber-200 text-sm">Llegás a la ubicación, preparás el terreno y plantás el árbol</p>
                </div>
                <div className="bg-white/10 dark:bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/10 dark:border-white/20 hover:bg-white/15 dark:hover:bg-white/20 transition-colors">
                  <Camera className="h-8 w-8 mb-3 text-amber-200" />
                  <h3 className="font-bold text-lg mb-1 text-white">Paso 4</h3>
                  <p className="text-amber-100 dark:text-amber-200 text-sm">Documentás con fotos durante el día, subís el reporte y recibís tu pago en 48hs</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-400 mb-3 text-center">
              Requisitos para ser Plantador
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Todo lo que necesitás para empezar
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto border border-amber-100 dark:border-gray-700">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-400 mb-3 text-center">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-amber-200 dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-800 dark:text-amber-400 text-base">{faq.question}</CardTitle>
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
            className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 text-white text-center"
          >
            <Shovel className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              ¿Querés ser de los primeros?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-amber-100">
              Registrate ahora y asegurá tu lugar como plantador fundador en Córdoba
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-amber-600"
                onClick={() => window.open(`${APP_URL}/registro/plantador`, '_blank')}
              >
                <Shovel className="h-5 w-5 mr-2" />
                Quiero ser Plantador Fundador
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                <Link to="/contacto">
                  Tengo más preguntas
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

export default PlantadoresPage;
