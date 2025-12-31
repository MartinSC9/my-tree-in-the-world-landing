import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Users, Ticket, TreePine, CheckCircle, Sparkles, Clock, MapPin } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import Footer from '@shared/components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const SorteosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-90" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center text-white"
          >
            {/* Badge próximamente */}
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4" />
                Próximamente en Córdoba
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6">
              <Gift className="h-20 w-20 mx-auto text-yellow-300" />
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
            >
              Sorteos de Cupones
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto mb-4"
            >
              Participá en proyectos colaborativos de empresas y ganá cupones de descuento.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-lg text-yellow-300 font-semibold mb-8">
              Mientras más aportás, más chances tenés de ganar.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-100 text-purple-600 font-semibold px-10 py-6 text-lg shadow-xl"
              >
                <Link to="/contacto">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Quiero saber cuando arranquen
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cómo Funciona - Simplificado */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-purple-800 dark:text-purple-400 mb-4"
            >
              ¿Cómo funciona?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Un sistema simple y transparente
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Paso simplificado */}
            <motion.div variants={fadeInUp}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl flex-shrink-0">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-1">
                        Empresas crean proyectos colaborativos
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Una empresa sponsor crea un proyecto para plantar árboles y ofrece cupones
                        de descuento como incentivo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-100 dark:bg-pink-900/50 p-3 rounded-xl flex-shrink-0">
                      <Ticket className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-400 mb-1">
                        Vos participás aportando lo que quieras
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Cada peso que aportás es un ticket para el sorteo. Aportás $500 = 500
                        tickets. Simple y justo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-xl flex-shrink-0">
                      <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
                        Se plantan los árboles y se sortean los cupones
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Cuando se completa el proyecto, se plantan los árboles y se sortean cupones
                        de descuento entre los participantes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Beneficio clave */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-purple-100 dark:border-gray-700 text-center"
          >
            <Gift className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-400 mb-4">
              Todos ganan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Ayudás a plantar árboles reales
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Participás en sorteos de cupones
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Aparecés en el certificado del árbol
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <MapPin className="h-4 w-4" />
              Comenzamos en Córdoba
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6 text-white">
              Próximamente
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
            >
              Estamos preparando los primeros sorteos con empresas de Córdoba. Dejanos tu contacto y
              te avisamos cuando lancemos.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-100 text-purple-600 font-semibold px-10 py-6 text-lg shadow-xl"
              >
                <Link to="/contacto">Avisarme cuando arranquen</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-10 py-6 text-lg"
              >
                <Link to="/empresas">Soy empresa, quiero participar</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SorteosPage;
