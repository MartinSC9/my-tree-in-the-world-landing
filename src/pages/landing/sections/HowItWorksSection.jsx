import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const HowItWorksSection = ({ howItWorksRef, howItWorksInView }) => {
  const steps = [
    {
      image: '/images/1.png',
      step: '01',
      title: 'Elegí tu árbol',
      desc: 'Seleccioná la ubicación en el mapa, ponele un nombre y elegí la especie.',
    },
    {
      image: '/images/2.png',
      step: '02',
      title: 'Lo plantamos por vos',
      desc: 'Viveros preparan tu árbol, chapistas fabrican tu placa QR. Plantadores profesionales lo plantan con fotos.',
    },
    {
      image: '/images/3.png',
      step: '03',
      title: 'Tu legado, para siempre',
      desc: 'Chapa de acero con QR instalada. Escaneá y accedé a tu página única. Certificado digital incluido.',
    },
  ];

  return (
    <section ref={howItWorksRef} className="py-16 md:py-24 px-4 bg-white dark:bg-gray-900 relative">
      <div className="container-wide">
        <motion.div
          initial="hidden"
          animate={howItWorksInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mb-12 max-w-xl"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3"
          >
            Asi funciona
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            De tu pantalla al suelo, en 3 pasos
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={howItWorksInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="group h-full">
                <div className="overflow-hidden rounded-xl mb-4">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.desc}
                  </p>
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
