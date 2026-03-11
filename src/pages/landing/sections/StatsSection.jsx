import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const StatsSection = ({ statsRef, statsInView, stats }) => {
  return (
    <section
      ref={statsRef}
      className="section-padding relative overflow-hidden bg-white dark:bg-gray-900"
    >
      <div className="absolute top-0 right-0 w-96 h-96 blob-shape nature-blob" />
      <div className="absolute bottom-0 left-0 w-80 h-80 blob-shape earth-blob" />

      <div className="container-wide relative z-10">
        <motion.div
          initial="hidden"
          animate={statsInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={scaleIn}>
              <div className="stats-card rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${stat.bgClass}`}
                >
                  <stat.icon className={`h-10 w-10 ${stat.colorClass}`} />
                </div>
                <motion.div
                  className={`font-display text-5xl font-bold mb-2 ${stat.colorClass}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
