import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, QrCode, Gift } from 'lucide-react';

const FreeTreeOptionsSection = ({ plantaSinPlataRef }) => {
  return (
    <section
      ref={plantaSinPlataRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-100/30 dark:bg-emerald-900/20 blur-3xl" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
            <Gift className="h-4 w-4" />
            <span>No necesitas dinero para empezar</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Plantá gratis, de tres maneras
          </h2>
        </motion.div>

        {/* Timeline/path layout */}
        <div className="max-w-4xl mx-auto relative">
          {/* Linea conectora vertical (solo desktop) */}
          <div className="hidden md:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-300 dark:from-emerald-700 dark:via-emerald-600 dark:to-emerald-700" />

          {/* Opcion 1: Referidos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex items-start gap-5 md:gap-8 mb-8 md:mb-10"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 rounded-full flex items-center justify-center shadow-sm z-10">
              <Users className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="pt-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                Invita 5 amigos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md">
                Compartí tu código. Cuando 5 amigos se unan y planten, recibís un árbol gratis en tu
                cuenta.
              </p>
            </div>
          </motion.div>

          {/* Opcion 2: Colaborativo - destaca con fondo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex items-start gap-5 md:gap-8 mb-8 md:mb-10"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-md z-10">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl px-5 py-4 flex-1 max-w-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                Árbol colaborativo
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Creá un proyecto y compartilo. Tus amigos y familia aportan lo que puedan hasta
                completar la meta entre todos.
              </p>
            </div>
          </motion.div>

          {/* Opcion 3: QR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex items-start gap-5 md:gap-8"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 rounded-full flex items-center justify-center shadow-sm z-10">
              <QrCode className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="pt-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                Escaneá y participá
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md">
                Productos de empresas partner incluyen códigos QR. Escaneá para participar en
                sorteos de árboles.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeTreeOptionsSection;
