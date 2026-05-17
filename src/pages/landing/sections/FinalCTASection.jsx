import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

const FinalCTASection = ({ ctaRef, APP_URL }) => {
  return (
    <section
      ref={ctaRef}
      className="py-14 md:py-20 px-4 bg-emerald-600 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Fondo sutil */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-700/30 dark:bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>
      {/* Borde superior en dark mode */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent dark:block hidden" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Empezá ahora
          </h2>
          <p className="text-lg text-emerald-100 dark:text-gray-300 mb-8">
            Explorá la plataforma, conectá con otros y plantá tu propio árbol.
          </p>
          <Button
            onClick={() => window.open(`${APP_URL}/feed`, '_blank')}
            size="lg"
            className="bg-white hover:bg-emerald-50 text-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white shadow-lg hover:shadow-xl px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Explorar la plataforma
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
