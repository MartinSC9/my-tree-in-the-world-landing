import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = ({ statsRef, statsInView, stats }) => {
  return (
    <section ref={statsRef} className="py-6 md:py-8 px-4 bg-gray-900 dark:bg-gray-950 relative">
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-16 lg:gap-x-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-baseline gap-2.5"
            >
              <span className="font-display text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-sm md:text-base text-gray-400 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
