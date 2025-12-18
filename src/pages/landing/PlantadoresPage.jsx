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
      question: '¿Cuánto puedo ganar?',
      answer: 'El pago por cada plantación varía según la ubicación y complejidad. En promedio, se paga entre $5.000 y $15.000 ARS por árbol plantado.'
    },
    {
      question: '¿Cómo recibo los pagos?',
      answer: 'Una vez que el usuario confirma la plantación, el pago se libera a tu cuenta en 48-72 horas vía transferencia bancaria.'
    },
    {
      question: '¿Necesito experiencia previa?',
      answer: 'No es obligatorio, pero sí valoramos conocimientos de jardinería. Ofrecemos guías y capacitación para asegurar plantaciones exitosas.'
    },
    {
      question: '¿Puedo rechazar asignaciones?',
      answer: 'Sí, tenés control total de tu agenda. Podés aceptar o rechazar trabajos según tu disponibilidad.'
    },
    {
      question: '¿Qué pasa si el árbol no sobrevive?',
      answer: 'Si seguiste las instrucciones correctamente y documentaste todo, no sos responsable. Trabajamos con garantía del vivero.'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos M.',
      location: 'Córdoba Capital',
      rating: 5,
      trees: 47,
      text: 'Empecé como hobby y ahora es mi segunda fuente de ingresos. Me encanta ver crecer los árboles que planté.'
    },
    {
      name: 'Laura G.',
      location: 'Villa Carlos Paz',
      rating: 5,
      trees: 32,
      text: 'La flexibilidad es increíble. Trabajo cuando puedo y siento que hago algo bueno por el planeta.'
    },
    {
      name: 'Martín R.',
      location: 'Alta Gracia',
      rating: 5,
      trees: 89,
      text: 'En 6 meses ya soy uno de los plantadores mejor calificados de mi zona. La comunidad es genial.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shovel className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4">
              Plantadores
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Convertite en parte de nuestra red de plantadores y ganá dinero mientras ayudás
              a reforestar el planeta. Trabajo flexible, al aire libre y con propósito.
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
              Quiero ser Plantador
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg"
            >
              <Link to="/contacto">
                Más información
              </Link>
            </Button>
          </motion.div>

          {/* Stats rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">150+</p>
              <p className="text-gray-600 text-sm">Plantadores activos</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">2.500+</p>
              <p className="text-gray-600 text-sm">Árboles plantados</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">4.8</p>
              <p className="text-gray-600 text-sm">Calificación promedio</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">$10K</p>
              <p className="text-gray-600 text-sm">Pago promedio/árbol</p>
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 text-center">
              ¿Por qué ser Plantador?
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Más que un trabajo, una forma de vida conectada con la naturaleza
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-amber-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className={`bg-${benefit.color}-100 w-14 h-14 rounded-full flex items-center justify-center mb-3`}>
                        <Icon className={`h-7 w-7 text-${benefit.color}-600`} />
                      </div>
                      <CardTitle className="text-amber-800 text-lg">{benefit.title}</CardTitle>
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
      <section className="py-12 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 text-center">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              En 4 simples pasos empezás a plantar y ganar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100 h-full">
                    <div className="bg-amber-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-amber-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
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

      {/* Testimonios */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 text-center">
              Lo que dicen nuestros Plantadores
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Conocé las experiencias de quienes ya son parte de la comunidad
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-amber-800">{testimonial.name}</p>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {testimonial.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">{testimonial.trees}</p>
                        <p className="text-gray-500 text-xs">árboles plantados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* El día de un plantador */}
      <section className="py-12 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 text-center">
              Un día como Plantador
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Así es la rutina típica de nuestros plantadores
            </p>

            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <Clock className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">8:00 AM</h3>
                  <p className="text-amber-100 text-sm">Revisás las notificaciones y aceptás una asignación cerca de tu zona</p>
                </div>
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <TreePine className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">9:30 AM</h3>
                  <p className="text-amber-100 text-sm">Retirás el árbol del vivero asignado con todas las instrucciones</p>
                </div>
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <Shovel className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">11:00 AM</h3>
                  <p className="text-amber-100 text-sm">Llegás a la ubicación, preparás el terreno y plantás el árbol</p>
                </div>
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <Camera className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">12:00 PM</h3>
                  <p className="text-amber-100 text-sm">Documentás con fotos, subís el reporte y recibís tu pago en 48hs</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 text-center">
              Requisitos para ser Plantador
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Todo lo que necesitás para empezar
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 text-center">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-800 text-base">{faq.question}</CardTitle>
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
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 text-white text-center"
          >
            <Shovel className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              ¿Listo para empezar a plantar?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-amber-100">
              Unite a la comunidad de plantadores y empezá a generar ingresos mientras cuidás el planeta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-amber-600"
                onClick={() => window.open(`${APP_URL}/registro/plantador`, '_blank')}
              >
                <Shovel className="h-5 w-5 mr-2" />
                Registrarme como Plantador
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
