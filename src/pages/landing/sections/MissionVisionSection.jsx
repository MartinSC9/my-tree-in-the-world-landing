import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, Users, ArrowRight, Target, Eye } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

const MissionVisionSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Leaf className="h-4 w-4" />
            <span>Sobre Nosotros</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            ¿Por Qué <span className="text-emerald-600 dark:text-emerald-400">Existimos</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 h-full hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Nuestra Misión</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Conectar a personas y empresas con la naturaleza a través de una plataforma
                tecnológica que facilita la plantación de árboles reales, democratizando el acceso a
                la reforestación y permitiendo que cada individuo contribuya activamente a la
                regeneración del medio ambiente.
              </p>
            </div>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 h-full hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Nuestra Visión</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Ser la plataforma líder en América Latina para la plantación colaborativa de
                árboles, creando un movimiento global donde cada persona pueda ver el impacto
                tangible de su contribución ambiental, logrando plantar un millón de árboles.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Valores destacados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Transparencia',
                desc: 'Estado de cada árbol en tiempo real, desde el vivero hasta su ubicación final.',
              },
              {
                icon: Target,
                title: 'Impacto Real',
                desc: 'Cada árbol es físico, plantado por un profesional, con coordenadas GPS verificables.',
              },
              {
                icon: Heart,
                title: 'Accesibilidad',
                desc: 'Cuidar el planeta al alcance de todos, sin barreras geográficas ni económicas.',
              },
              {
                icon: Users,
                title: 'Colaboración',
                desc: 'Usuarios, empresas, viveros y plantadores conectados en un mismo ecosistema.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <value.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm">
                  {value.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA a Sobre Nosotros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Button
            asChild
            variant="outline"
            className="border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            <Link to="/sobre-nosotros">
              Ver todos nuestros valores y compromiso
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
