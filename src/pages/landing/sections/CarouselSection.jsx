import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

// Carousel images
import carousel1 from '@/assets/images/carousel/1.png';
import carousel2 from '@/assets/images/carousel/2.png';
import carousel3 from '@/assets/images/carousel/3.png';
import carousel4 from '@/assets/images/carousel/4.png';
import carousel5 from '@/assets/images/carousel/5.png';
import carousel6 from '@/assets/images/carousel/6.png';
import carousel7 from '@/assets/images/carousel/7.png';
import carousel8 from '@/assets/images/carousel/8.png';
import carousel9 from '@/assets/images/carousel/9.png';

const CarouselSection = ({ carouselRef, APP_URL }) => {
  return (
    <section
      ref={carouselRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Users className="h-4 w-4" />
            <span>Nuestra Comunidad</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Descubre la{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              App Social
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Conecta con otros plantadores, comparte tu progreso y sigue el crecimiento de tu árbol
            en tiempo real.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Gradient fades on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

          {/* Scrolling carousel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 py-4"
              animate={{ x: [0, -2880] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {/* App Screenshots - duplicated for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {[
                    carousel1,
                    carousel2,
                    carousel3,
                    carousel4,
                    carousel5,
                    carousel6,
                    carousel7,
                    carousel8,
                    carousel9,
                  ].map((img, index) => (
                    <div key={`${setIndex}-${index}`} className="flex-shrink-0">
                      <div className="relative group">
                        {/* Phone frame effect */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-emerald-500/30">
                          {/* Screen */}
                          <div className="rounded-[2rem] overflow-hidden bg-black">
                            {/* Notch */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full z-10" />
                            <img
                              src={img}
                              alt={`App screenshot ${index + 1}`}
                              className="w-64 md:w-72 h-auto object-cover"
                            />
                          </div>
                        </div>
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => window.open(`${APP_URL}/feed`, '_blank')}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg px-8 shadow-lg shadow-emerald-500/30"
          >
            <Users className="h-5 w-5 mr-2" />
            Explora la App
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CarouselSection;
