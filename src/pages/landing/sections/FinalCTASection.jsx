import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Users, ArrowRight } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

const FinalCTASection = ({ ctaRef, APP_URL }) => {
  return (
    <section
      ref={ctaRef}
      className="section-padding bg-emerald-600 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/30 dark:bg-emerald-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-700/30 dark:bg-emerald-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      {/* Borde superior verde en dark mode */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent dark:block hidden" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <TreePine className="h-20 w-20 mx-auto mb-6 text-white" />
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Únete a la Comunidad
          </h2>
          <p className="text-xl md:text-2xl text-emerald-100 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Explora la plataforma, conecta con otros y próximamente planta tu propio árbol.
          </p>
          <Button
            onClick={() => window.open(`${APP_URL}/feed`, '_blank')}
            size="lg"
            className="bg-white hover:bg-emerald-50 text-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white shadow-xl hover:shadow-2xl px-12 py-7 text-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Users className="h-6 w-6 mr-3" />
            Ir a la App
            <ArrowRight className="h-6 w-6 ml-3" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
