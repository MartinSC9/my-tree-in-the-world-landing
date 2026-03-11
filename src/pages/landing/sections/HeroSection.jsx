import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TreePine,
  Globe,
  Users,
  Leaf,
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import heroBackground from '@/assets/images/login-background.jpeg';

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

const HeroSection = ({ heroRef, heroOpacity, heroScale, APP_URL, carouselRef }) => {
  return (
    <section
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <img
          src={heroBackground}
          alt="Bosque"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="container-wide relative z-10 px-4 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-white"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <Leaf className="h-4 w-4 text-emerald-400" />
                Plataforma de reforestación
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
            >
              Tu Árbol,{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Tu Legado
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-green-100/90 mb-8 leading-relaxed max-w-xl"
            >
              Conectamos personas y empresas con la naturaleza facilitando la plantación de árboles
              reales. Cada árbol tiene identidad propia, ubicación GPS y seguimiento verificable.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={() => window.open(`${APP_URL}/feed`, '_blank')}
                size="lg"
                className="btn-primary group text-lg px-8 bg-emerald-500 hover:bg-emerald-600"
              >
                <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Ir a la App
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg px-8"
              >
                <Link to="/mapa">
                  <Globe className="h-5 w-5 mr-2" />
                  Ver Mapa Global
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-6 text-sm text-green-100/70"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Transparencia total</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Árboles reales verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>Especies nativas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Comunidad activa</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Features Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main floating card */}
              <div className="glass-dark rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-500/20 p-3 rounded-xl">
                    <TreePine className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">Impacto Real</p>
                    <p className="text-green-200/70">No árboles virtuales</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm text-white">Seguimiento transparente en tiempo real</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm text-white">Ubicación GPS y chapa QR en cada árbol</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm text-white">Usuarios, viveros y plantadores conectados</p>
                  </div>
                </div>
              </div>

              {/* Secondary floating card */}
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Accesible para Todos</p>
                    <p className="text-xs text-green-200/70">
                      Cuidar el planeta al alcance de todos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center cursor-pointer mt-12"
          onClick={() => carouselRef.current?.scrollIntoView({ behavior: 'smooth' })}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-white/60 text-sm mb-2">Descubre más</span>
          <div className="border-2 border-white/40 rounded-full p-2">
            <ChevronDown className="h-5 w-5 text-white/60" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
