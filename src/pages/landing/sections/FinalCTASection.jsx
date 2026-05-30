import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

const FinalCTASection = ({ ctaRef, APP_URL }) => {
  return (
    <section ref={ctaRef} className="py-14 md:py-20 px-4 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-950/75" />
      </div>
      {/* Borde superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

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
          <p className="text-lg text-gray-300 mb-8">
            Explorá la plataforma, conectá con otros y plantá tu propio árbol.
          </p>
          <Button
            onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
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
