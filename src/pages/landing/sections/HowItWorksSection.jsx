import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
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

const HowItWorksSection = ({ howItWorksRef, howItWorksInView }) => {
  return (
    <section
      ref={howItWorksRef}
      className="section-padding premium-gradient relative overflow-hidden"
    >
      <div className="container-wide relative z-10">
        <motion.div
          initial="hidden"
          animate={howItWorksInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="section-title mb-6">
            Cómo Funciona
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            En 3 simples pasos, tu árbol estará plantado y con su propia identidad.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          animate={howItWorksInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
        >
          {[
            {
              image: '/images/1.png',
              title: '1. Compra tu Árbol',
              desc: 'Elige la ubicación en el mapa, ponle un nombre y selecciona la especie que más te guste.',
            },
            {
              image: '/images/2.png',
              title: '2. Plantación Real',
              desc: 'Viveros preparan tu árbol mientras chapistas fabrican tu placa QR. Plantadores profesionales lo plantan con fotos.',
            },
            {
              image: '/images/3.png',
              title: '3. Tu Árbol, Tu Legado',
              desc: 'Chapa de acero con QR instalada junto al árbol. Escanea y accede a tu página única. Certificado digital incluido.',
            },
          ].map((step, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center flex w-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full w-full border border-gray-100 dark:border-gray-700">
                <div className="overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3 flex-1">
                    {step.desc}
                  </p>
                  {step.price && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                      {step.price}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
