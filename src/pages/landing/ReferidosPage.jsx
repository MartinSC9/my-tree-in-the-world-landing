import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Gift,
  TreePine,
  ArrowRight,
  CheckCircle,
  Coins,
  Share2,
  Trophy,
  Target,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const ReferidosPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Users className="h-20 w-20 mx-auto mb-6 text-white/90" />
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Sistema de Referidos
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-purple-100 mb-8">
              Invitá amigos, ganá puntos y plantá árboles gratis
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="bg-white hover:bg-gray-50 text-purple-600 shadow-xl hover:shadow-2xl px-10 py-6 text-lg"
              >
                <Gift className="h-6 w-6 mr-3" />
                Comenzar a Invitar
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              ¿Cómo Funciona?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Un sistema simple que premia tu participación
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Share2,
                title: 'Compartí tu código',
                desc: 'Cada usuario tiene un código único para compartir',
                color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
              },
              {
                icon: Users,
                title: 'Tu amigo se registra',
                desc: 'Se vincula a tu cuenta usando tu código',
                color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
              },
              {
                icon: TreePine,
                title: 'Tu amigo planta',
                desc: 'Cuando planta su primer árbol, vos ganás 500 pts',
                color: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
              },
              {
                icon: Coins,
                title: 'Canjeá tus puntos',
                desc: 'Usá tus puntos para descuentos o árboles gratis',
                color: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
              },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sistema de Puntos */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Coins className="h-14 w-14 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Sistema de EcoPoints
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Ganá puntos por cada acción y canjeálos por beneficios reales
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Cómo ganar puntos */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-6 flex items-center">
                    <Target className="h-7 w-7 mr-3" />
                    Cómo Ganar Puntos
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          Amigo se registra
                        </span>
                      </div>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        Se vincula
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-3">
                        <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          Amigo planta un árbol
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +500 pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          Amigo colabora en proyecto
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        +200 pts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Qué puedo canjear */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center">
                    <Gift className="h-7 w-7 mr-3" />
                    Qué Podés Canjear
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="font-medium text-gray-800 dark:text-white">
                        15% de descuento
                      </span>
                      <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
                        500 pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="font-medium text-gray-800 dark:text-white">
                        30% de descuento
                      </span>
                      <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
                        1,000 pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-300 dark:border-green-700">
                      <div className="flex items-center gap-2">
                        <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <span className="font-bold text-green-700 dark:text-green-400">
                          ÁRBOL GRATIS
                        </span>
                      </div>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        2,500 pts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Escenarios de Ejemplo */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Ejemplos Reales
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Mirá cuánto podés ganar invitando amigos
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                scenario: '1 amigo planta',
                compras: 'su primer árbol',
                puntos: '500 pts',
                beneficio: '15% de descuento',
                color: 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800',
              },
              {
                scenario: '2 amigos plantan',
                compras: 'su primer árbol',
                puntos: '1,000 pts',
                beneficio: '30% de descuento',
                color: 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20',
              },
              {
                scenario: '5 amigos plantan',
                compras: 'su primer árbol',
                puntos: '2,500 pts',
                beneficio: '¡ÁRBOL GRATIS!',
                color: 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20',
                highlight: true,
              },
            ].map((example, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card
                  className={`h-full border-2 ${example.color} ${example.highlight ? 'ring-2 ring-green-400 dark:ring-green-500' : ''}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {example.scenario}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{example.compras}</p>
                    </div>
                    <div className="py-4 border-t border-b border-gray-200 dark:border-gray-600 my-4">
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {example.puntos}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${example.highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {example.beneficio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Beneficios del Sistema
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              'Sistema anti-fraude: puntos solo cuando plantan',
              'Meta clara: 5 referidos que planten = árbol gratis',
              'Puntos acumulables sin vencimiento',
              '500 pts por cada amigo que plante su primer árbol',
              'Código único fácil de compartir',
              'Seguimiento en tiempo real de tus referidos',
            ].map((benefit, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Trophy className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              ¡Empezá a Ganar Hoy!
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
            >
              Registrate, obtené tu código único y empezá a invitar amigos para ganar puntos y
              árboles gratis.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="bg-white hover:bg-gray-50 text-purple-600 shadow-xl hover:shadow-2xl px-12 py-7 text-xl font-semibold"
              >
                <Users className="h-6 w-6 mr-3" />
                Registrarme y Obtener mi Código
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReferidosPage;
