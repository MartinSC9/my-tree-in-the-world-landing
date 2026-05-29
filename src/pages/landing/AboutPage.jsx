import React from 'react';
import { motion } from 'framer-motion';
import {
  TreePine,
  Heart,
  Globe,
  Users,
  Target,
  Leaf,
  Eye,
  Shield,
  Link2,
  Lightbulb,
  Sprout,
  CheckCircle2,
  Camera,
  Bell,
  MapPin,
  BadgeCheck,
  TrendingUp,
  Linkedin,
  Store,
  QrCode,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useTheme } from '@core/contexts/ThemeContext';
import heroBackground from '@/assets/images/login-background.jpeg';

const AboutPage = () => {
  const { isDark } = useTheme();

  const values = [
    {
      icon: Shield,
      title: 'Transparencia',
      description:
        'Mostramos en tiempo real el estado de cada árbol plantado, desde el vivero hasta su ubicación final. Cada usuario puede seguir el ciclo completo de su árbol con información verificable.',
    },
    {
      icon: Target,
      title: 'Impacto Real',
      description:
        'No somos una plataforma de árboles virtuales: cada árbol que se planta en nuestra app corresponde a un árbol físico plantado por un profesional, en un lugar real, con coordenadas GPS verificables.',
    },
    {
      icon: Heart,
      title: 'Accesibilidad',
      description:
        'Creemos que cuidar el planeta debe estar al alcance de todos. Nuestra plataforma elimina las barreras geográficas y económicas para que cualquier persona pueda contribuir a la reforestación.',
    },
    {
      icon: Link2,
      title: 'Colaboración',
      description:
        'Conectamos usuarios, empresas, viveros y plantadores en un ecosistema donde cada rol es esencial. El trabajo en equipo multiplica nuestro impacto ambiental.',
    },
    {
      icon: Lightbulb,
      title: 'Innovación con Propósito',
      description:
        'Utilizamos la tecnología como herramienta para resolver problemas ambientales reales. Cada funcionalidad que desarrollamos tiene como objetivo facilitar y amplificar el impacto positivo.',
    },
    {
      icon: Sprout,
      title: 'Responsabilidad Ambiental',
      description:
        'Nos comprometemos con prácticas sostenibles en toda nuestra operación. Seleccionamos especies nativas, respetamos los ecosistemas locales y priorizamos la biodiversidad.',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description:
        'Fomentamos una comunidad activa de personas comprometidas con el medio ambiente, donde cada árbol plantado es un lazo que une a quienes comparten el deseo de un planeta más verde.',
    },
  ];

  const commitments = [
    {
      icon: Camera,
      text: 'Verificar cada árbol plantado con fotografías y ubicación GPS',
    },
    {
      icon: Bell,
      text: 'Informar periódicamente sobre el estado de los árboles',
    },
    {
      icon: MapPin,
      text: 'Seleccionar especies apropiadas para cada región',
    },
    {
      icon: BadgeCheck,
      text: 'Trabajar con viveros y plantadores locales certificados',
    },
    {
      icon: TrendingUp,
      text: 'Reinvertir en la mejora continua de nuestra plataforma y operaciones',
    },
  ];

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}
    >
      {/* Quiénes Somos - Hero con fotos grandes */}
      <section className="relative overflow-hidden pt-8 md:pt-12 pb-12 md:pb-16 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        ></div>
        <div
          className={`absolute inset-0 ${isDark ? 'bg-gray-900/80' : 'bg-white/70 backdrop-blur-[2px]'}`}
        ></div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1
              className={`text-4xl md:text-5xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-green-800'}`}
            >
              Quiénes Somos
            </h1>
            <p
              className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-green-700'}`}
            >
              Dos jóvenes de Córdoba, Argentina, usando tecnología como herramienta real de cambio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Nahuel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                className={`h-full hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/95 border-green-200'
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex justify-center pt-6 pb-4">
                    <img
                      src="/images/nahuel.jpg"
                      alt="Nahuel Carballo"
                      className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-green-300 dark:border-emerald-500 shadow-lg"
                    />
                  </div>
                  <div className="px-6 pb-6 text-center">
                    <h3
                      className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-green-800'}`}
                    >
                      Nahuel Carballo
                    </h3>
                    <p className={`text-sm mb-3 ${isDark ? 'text-emerald-400' : 'text-green-600'}`}>
                      Fundador & Hardware/Sistemas
                    </p>
                    <p
                      className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-green-700'}`}
                    >
                      Técnico electrónico y estudiante de Ingeniería en Sistemas (UTN). Experiencia
                      en análisis de hardware, producción industrial y desarrollo de software. La
                      visión de campo y la conexión con el mundo físico.
                    </p>
                    <a
                      href="https://www.linkedin.com/in/nahuel-carballo-a59408265"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm font-medium ${
                        isDark
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Martin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Card
                className={`h-full hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/95 border-green-200'
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex justify-center pt-6 pb-4">
                    <img
                      src="/images/martin.png"
                      alt="Martín Contrera"
                      className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-green-300 dark:border-emerald-500 shadow-lg"
                    />
                  </div>
                  <div className="px-6 pb-6 text-center">
                    <h3
                      className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-green-800'}`}
                    >
                      Martín Contrera
                    </h3>
                    <p className={`text-sm mb-3 ${isDark ? 'text-emerald-400' : 'text-green-600'}`}>
                      Co-fundador & Desarrollador
                    </p>
                    <p
                      className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-green-700'}`}
                    >
                      Desarrollador de software con +4 años en producción. Especializado en IoT, IA
                      y automatizaciones. Diseñó y construyó toda la arquitectura de la plataforma —
                      desde el backend hasta la app móvil.
                    </p>
                    <a
                      href="https://www.linkedin.com/in/martincontrera"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm font-medium ${
                        isDark
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`text-center mt-8 text-base md:text-lg max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-green-700'}`}
          >
            En 2025 transformamos una idea en realidad: una plataforma con trazabilidad real,
            coordenadas GPS y seguimiento. La tecnología tiene que tocar la tierra, ayudar a los
            viveros, conectar personas y regenerar ecosistemas.
          </motion.p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Misión */}
            <div>
              <div
                className={`inline-block p-4 rounded-2xl mb-6 ${isDark ? 'bg-emerald-900/50' : 'bg-green-100'}`}
              >
                <Target className={`h-12 w-12 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-green-800'}`}>
                Nuestra Misión
              </h2>
              <p
                className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-green-700'}`}
              >
                Conectar a personas y empresas con la naturaleza a través de una plataforma
                tecnológica que facilita la plantación de árboles reales, democratizando el acceso a
                la reforestación y permitiendo que cada individuo contribuya activamente a la
                regeneración del medio ambiente desde cualquier lugar del mundo.
              </p>
            </div>

            {/* Visión */}
            <div>
              <div
                className={`inline-block p-4 rounded-2xl mb-6 ${isDark ? 'bg-emerald-900/50' : 'bg-green-100'}`}
              >
                <Eye className={`h-12 w-12 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-green-800'}`}>
                Nuestra Visión
              </h2>
              <p
                className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-green-700'}`}
              >
                Ser la plataforma líder en América Latina para la plantación colaborativa de
                árboles, creando un movimiento global donde cada persona pueda ver el impacto
                tangible de su contribución ambiental, logrando plantar un millón de árboles y
                estableciendo un nuevo estándar en la conexión entre tecnología y sostenibilidad.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section
        className={`py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-green-800'}`}
            >
              Nuestros Valores
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-green-700'}`}
            >
              Los principios que guían cada decisión que tomamos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.08 }}
              >
                <Card
                  className={`h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.03] ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-200'
                  }`}
                >
                  <CardHeader>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        isDark
                          ? 'bg-emerald-900/50'
                          : 'bg-gradient-to-br from-green-100 to-emerald-100'
                      }`}
                    >
                      <value.icon
                        className={`h-7 w-7 ${isDark ? 'text-emerald-400' : 'text-green-600'}`}
                      />
                    </div>
                    <CardTitle
                      className={`text-center text-base ${isDark ? 'text-white' : 'text-green-800'}`}
                    >
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-center text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-green-700'}`}
                    >
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Compromiso */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <CheckCircle2
              className={`h-16 w-16 mx-auto mb-6 ${isDark ? 'text-emerald-400' : 'text-green-600'}`}
            />
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-green-800'}`}>
              Nuestro Compromiso
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-green-700'}`}>
              En Mi Árbol en el Mundo nos comprometemos a:
            </p>
          </motion.div>

          <div className="space-y-4">
            {commitments.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className={`flex items-center gap-4 p-5 rounded-xl transition-all ${
                  isDark
                    ? 'bg-gray-700/50 hover:bg-gray-700'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-emerald-900/50' : 'bg-green-600'
                  }`}
                >
                  <item.icon className={`h-6 w-6 ${isDark ? 'text-emerald-400' : 'text-white'}`} />
                </div>
                <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-green-800'}`}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Trabajamos - Deshabilitado temporalmente
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBackground})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/90 to-emerald-900/90"></div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center mb-12">
            <Leaf className="h-14 w-14 mx-auto mb-4 text-emerald-300" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Cómo Trabajamos</h2>
            <p className="text-lg text-green-200 max-w-2xl mx-auto">Tecnología + naturaleza, de la mano</p>
          </motion.div>
        </div>
      </section>
      */}
    </div>
  );
};

export default AboutPage;
