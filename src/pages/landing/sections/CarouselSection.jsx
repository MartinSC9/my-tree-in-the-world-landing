import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
    <section ref={carouselRef} className="py-14 md:py-20 bg-gray-950 relative overflow-hidden">
      <div className="container-wide relative z-10 mb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Una app social para el planeta
          </h2>
          <p className="text-gray-400 text-base">
            Feed, chat, rankings, certificados y mas. Todo desde tu celular.
          </p>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4 py-4"
            animate={{ x: [0, -2880] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 45,
                ease: 'linear',
              },
            }}
          >
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
                    <div className="rounded-2xl overflow-hidden shadow-lg shadow-black/30">
                      <img
                        src={img}
                        alt={`App screenshot ${index + 1}`}
                        className="w-56 md:w-64 h-auto object-cover"
                      />
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="container-wide px-4 mt-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            onClick={() => window.open(`${APP_URL}/feed`, '_blank')}
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-7"
          >
            Explorar la App
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CarouselSection;
