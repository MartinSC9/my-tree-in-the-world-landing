import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, QrCode, Gift } from 'lucide-react';

const FreeTreeOptionsSection = ({ plantaSinPlataRef }) => {
  return (
    <section
      ref={plantaSinPlataRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-100/30 dark:bg-emerald-900/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gray-200/30 dark:bg-gray-800/30 blur-3xl" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge simple */}
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Gift className="h-4 w-4" />
            <span>No necesitas dinero para empezar</span>
          </div>

          {/* Titulo limpio */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            <span className="text-emerald-600 dark:text-emerald-400">3</span> Formas de Plantar{' '}
            <span className="text-emerald-600 dark:text-emerald-400">GRATIS</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            No hace falta dinero para ser parte del cambio. Elige la opción que mejor te funcione.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Opcion 1: Referidos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col group-hover:-translate-y-1">
              {/* Numero de opcion */}
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">1</span>
              </div>

              {/* Icono */}
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                <Users className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Invita 5 Amigos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 text-sm leading-relaxed">
                Comparte tu código. Cuando 5 amigos planten, tienes un{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  árbol gratis
                </span>
                .
              </p>
            </div>
          </motion.div>

          {/* Opcion 2: Colaborativo - Card destacada */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group"
          >
            <div className="relative bg-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
              {/* Badge popular */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  MÁS POPULAR
                </div>
              </div>

              {/* Numero de opcion */}
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xs">2</span>
              </div>

              {/* Icono */}
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:scale-105 transition-transform border border-white/30">
                <Heart className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Árbol Colaborativo</h3>
              <p className="text-emerald-100 mb-4 flex-1 text-sm leading-relaxed">
                Crea un proyecto y compártelo. Tus amigos{' '}
                <span className="font-semibold text-white">aportan lo que puedan</span> para
                completar la meta.
              </p>
            </div>
          </motion.div>

          {/* Opcion 3: QR Productos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col group-hover:-translate-y-1">
              {/* Numero de opcion */}
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">3</span>
              </div>

              {/* Icono */}
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                <QrCode className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Escanea y Gana
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 text-sm leading-relaxed">
                Productos de empresas partner tienen QR. Escanea y{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  participa en sorteos
                </span>{' '}
                de árboles.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeTreeOptionsSection;
