import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Target, Eye } from 'lucide-react';

const MissionVisionSection = () => {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
          {/* Mision - lado izquierdo, mayor presencia */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Nuestra Misión
              </span>
            </div>
            <p className="text-xl md:text-2xl lg:text-[1.7rem] text-gray-700 dark:text-gray-200 leading-relaxed font-light">
              Conectar a personas y empresas con la naturaleza a través de una plataforma
              tecnológica que facilita la plantación de árboles reales,{' '}
              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                democratizando el acceso a la reforestación
              </span>{' '}
              y permitiendo que cada individuo contribuya activamente a la regeneración del medio
              ambiente.
            </p>
          </motion.div>

          {/* Vision - lado derecho, como pull-quote */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="border-l-4 border-teal-500 dark:border-teal-400 pl-6 py-2">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-medium text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                  Visión
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                "Ser la plataforma líder en América Latina para la plantación colaborativa de
                árboles, creando un movimiento donde cada persona pueda ver el impacto tangible de
                su contribución ambiental — logrando plantar un millón de árboles."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
