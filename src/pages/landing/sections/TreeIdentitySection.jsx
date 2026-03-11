import React from 'react';
import { motion } from 'framer-motion';
import { Globe, QrCode, Shield, CheckCircle, FileText } from 'lucide-react';

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

const TreeIdentitySection = ({ uniqueRef, uniqueInView }) => {
  return (
    <section ref={uniqueRef} className="section-padding relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/arbol-identidad.jpeg')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="container-wide relative z-10">
        <motion.div
          initial="hidden"
          animate={uniqueInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <QrCode className="h-16 w-16 mx-auto mb-6 text-white/90 floating" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="section-title !text-white mb-6">
            Cada Árbol Tiene su Propia{' '}
            <span className="text-gradient bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
              Identidad
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-green-100/90 max-w-3xl mx-auto leading-relaxed"
          >
            Cuando plantas con nosotros, tu árbol recibe una identidad única y verificable.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={uniqueInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          className="glass-dark rounded-3xl p-8 md:p-12"
        >
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Physical Tag */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors h-full">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-emerald-400/20 p-4 rounded-xl">
                  <Shield className="h-7 w-7 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">Chapa Física con QR</h4>
                </div>
              </div>
              <ul className="space-y-3 text-green-100">
                {[
                  'Acero inoxidable anti-oxidación',
                  'Durabilidad garantizada 10+ años',
                  'QR que muestra tu nombre y mensaje',
                  'Instalada junto al árbol',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Web Page */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors h-full">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-emerald-400/20 p-4 rounded-xl">
                  <Globe className="h-7 w-7 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">Página Web Única</h4>
                </div>
              </div>
              <ul className="space-y-3 text-green-100">
                {[
                  'Foto real de tu árbol plantado',
                  'Ubicación exacta con GPS',
                  'Especie y fecha de plantación',
                  'Información de quién lo plantó',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificate */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors h-full">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-emerald-400/20 p-4 rounded-xl">
                  <FileText className="h-7 w-7 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">Certificado Digital</h4>
                </div>
              </div>
              <ul className="space-y-3 text-green-100">
                {[
                  'Coordenadas GPS exactas',
                  'Descargable en formato PDF',
                  'Compartible en redes sociales',
                  'Verificable online con QR',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TreeIdentitySection;
