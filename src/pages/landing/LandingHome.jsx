import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Globe, Users, Award, Leaf, Building2, Heart, QrCode, Microscope, Shield, Droplets, Sprout, CheckCircle } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import Footer from '@shared/components/layout/Footer';

// URL de la app (para login/registro)
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5174';

const LandingHome = () => {
  const { trees } = useTree();
  const { user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  // Redirección automática si el usuario ya está logueado
  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role, user.id);
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, getRedirectPath, navigate]);

  const totalTrees = trees.length;
  const physicalTrees = trees.filter(tree => tree.isPhysical).length;
  const companiesCount = [...new Set(trees.filter(tree => tree.companyName).map(tree => tree.companyName))].length;

  const stats = [
    { icon: TreePine, label: 'Árboles Comprados', value: totalTrees, color: 'text-green-600', description: 'Total de árboles adquiridos' },
    { icon: Leaf, label: 'Ya Plantados', value: physicalTrees, color: 'text-emerald-600', description: 'Plantados físicamente' },
    { icon: Building2, label: 'Empresas Participantes', value: companiesCount, color: 'text-orange-600', description: 'Empresas que ayudan' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-24 md:py-32 px-4"
        style={{
          backgroundImage: 'url(https://img.freepik.com/fotos-premium/plantar-arboles-crecer-suelo-sobre-fondo-verde_44622-1057.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-emerald-800/60 to-teal-900/70"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
              Mi Árbol en el Mundo
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-green-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ayudamos a reforestar el planeta gracias al compromiso de personas como vos.
              <span className="block mt-2 font-semibold text-white">Cada árbol que comprás se planta realmente en el lugar elegido.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <TreePine className="h-6 w-6 mr-3" />
                Comenzar Ahora
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link to="/mapa">
                  <Globe className="h-6 w-6 mr-3" />
                  Ver Mapa Global
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/90 backdrop-blur-sm border-green-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3 pt-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                  {stat.description && (
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-16"
          >
            <Heart className="h-16 w-16 mx-auto mb-6 text-white" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Nuestra Misión</h2>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              En "Mi Árbol en el Mundo" ayudamos a reforestar el planeta gracias al compromiso de personas como vos.
              Cada vez que alguien compra un árbol en nuestra plataforma, se planta un árbol real en el lugar elegido.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <QrCode className="h-16 w-16 mx-auto text-green-200 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">Cada Árbol Tiene su Propia Identidad Digital</h3>
              <p className="text-green-100 text-lg max-w-3xl mx-auto leading-relaxed">
                Tu árbol recibe un código QR único instalado en una chapa de acero inoxidable anti-oxidación
              </p>
            </div>

            {/* Imagen ilustrativa del QR en el sendero */}
            <div className="flex justify-center mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md">
                <img
                  src="https://preview.redd.it/the-walking-trail-around-the-park-i-visited-has-signs-v0-8uo37xifrl4b1.jpg?width=640&crop=smart&auto=webp&s=3aff62b51923974ec61020621a9f0f4cde7c058b"
                  alt="Ejemplo de cartel QR instalado en sendero"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm text-center font-medium">
                    Así lucen nuestros carteles QR instalados junto a cada árbol
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Chapa Física */}
              <div className="bg-white/20 rounded-xl p-6 border border-white/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-green-200 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-green-800" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Chapa Resistente</h4>
                    <p className="text-green-100 text-sm">Acero inoxidable anti-oxidación</p>
                  </div>
                </div>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Durabilidad de 10+ años en exteriores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Nombre personalizado del árbol grabado con láser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Resistente a lluvia, sol y temperaturas extremas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Instalada en poste junto al árbol</span>
                  </li>
                </ul>
              </div>

              {/* Página Web del QR */}
              <div className="bg-white/20 rounded-xl p-6 border border-white/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-green-200 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-green-800" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Página Web Única</h4>
                    <p className="text-green-100 text-sm">Al escanear el QR, se abre una página con:</p>
                  </div>
                </div>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Nombre y foto de tu árbol</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Ubicación exacta en mapa con GPS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Todos los que aportaron (para árboles colaborativos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Información de especie, vivero y plantador</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Impacto ambiental (CO₂ absorbido, agua filtrada)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Ejemplo visual */}
            <div className="bg-gradient-to-r from-white/30 to-white/20 rounded-xl p-6 border-2 border-green-300">
              <p className="text-white font-bold text-center mb-4">Ejemplo de lo que verán al escanear tu QR:</p>
              <div className="bg-white/10 rounded-lg p-4 space-y-3">
                <p className="text-white text-center">
                  <span className="text-2xl">🌳</span>
                </p>
                <p className="text-green-200 font-bold text-center text-lg">
                  "Jacarandá de la Abuela María"
                </p>
                <p className="text-green-100 text-center text-sm italic">
                  Este árbol fue plantado gracias a Martín López
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-100 mt-4">
                  <div className="text-center">
                    <p className="font-semibold">📍 Ubicación</p>
                    <p>Plaza San Martín</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">🌱 Especie</p>
                    <p>Jacaranda mimosifolia</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">📅 Plantado</p>
                    <p>15 Enero 2025</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">🌍 CO₂ Absorbido</p>
                    <p>21.77 kg/año</p>
                  </div>
                </div>
                <p className="text-green-200 text-center text-xs mt-4">
                  👥 Para árboles colaborativos: Se muestran TODOS los participantes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Environmental Commitment Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <Microscope className="h-16 w-16 mx-auto mb-6 text-green-600" />
            <h2 className="text-4xl font-bold text-green-800 mb-6">Plantamos con Conciencia Ambiental</h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Cada árbol es seleccionado cuidadosamente por botánicos y especialistas en ecología
              para que sea el adecuado para la zona.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="h-full bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Droplets className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-red-800">Lo que NO hacemos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-red-700">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Evitamos plantar especies que consumen mucha agua en zonas secas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>No introducimos árboles urbanos en ecosistemas naturales delicados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>No plantamos cualquier árbol en cualquier lado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-green-800">Nuestro Compromiso</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Leaf className="h-16 w-16 mx-auto mb-4 text-green-600" />
                    <p className="text-green-700 text-lg font-medium leading-relaxed">
                      Nuestro compromiso es con el planeta y la biodiversidad.
                      Cada decisión se toma pensando en el equilibrio ecológico.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-green-800 mb-6">¿Cómo Funciona?</h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Únete a nuestra comunidad global de reforestadores y obtén increíbles beneficios mientras ayudas al planeta
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 max-w-3xl mx-auto shadow-lg">
              <p className="text-blue-800 font-medium text-lg">
                <strong>¡Todos son bienvenidos!</strong> Puedes crear tu cuenta gratuita y ser parte de nuestra comunidad
                incluso sin comprar árboles. Accede al mapa global, únete a las conversaciones y aprende sobre sostenibilidad.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TreePine className="h-10 w-10 text-green-700" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-green-800 mb-3">1. Compra tu Árbol</h3>
                <p className="text-green-700 leading-relaxed">
                  Elige tu país, dale un nombre a tu árbol y realiza la compra. Un árbol real será plantado por nuestros especialistas.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="h-10 w-10 text-blue-700" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-green-800 mb-3">2. Plantación Real</h3>
                <p className="text-green-700 leading-relaxed">
                  Nuestros especialistas plantan tu árbol en el lugar elegido con un código QR único para su seguimiento.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Award className="h-10 w-10 text-yellow-700" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-green-800 mb-3">3. Seguimiento y Certificado</h3>
                <p className="text-green-700 leading-relaxed">
                  Tu árbol aparece en el mapa mundial y recibes tu certificado digital personalizado con coordenadas GPS.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-green-800 mb-4">Beneficios de Nuestra Comunidad</h3>
              <p className="text-lg text-green-700 max-w-2xl mx-auto">
                Desde el momento que te registras, formas parte de nuestra familia ecológica.
                Mientras más árboles plantas, más beneficios desbloqueas.
              </p>
            </div>

            {/* Free benefits */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border border-blue-200">
              <h4 className="text-2xl font-bold text-blue-800 mb-4 text-center">Beneficios Gratuitos para Todos</h4>
              <p className="text-center text-blue-700 mb-6">Solo necesitas crear tu cuenta gratuita para acceder a:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 text-center">
                  <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-blue-800 mb-1">Mapa Global</h5>
                  <p className="text-xs text-blue-600">Explora todos los árboles plantados</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-blue-800 mb-1">Red Social</h5>
                  <p className="text-xs text-blue-600">Conecta con otros eco-warriors</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 text-center">
                  <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-blue-800 mb-1">Contenido Educativo</h5>
                  <p className="text-xs text-blue-600">Aprende sobre sostenibilidad</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 text-center">
                  <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-blue-800 mb-1">Impacto Global</h5>
                  <p className="text-xs text-blue-600">Sigue el progreso mundial</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <Users className="h-5 w-5 mr-2" />
                  ¡Únete Gratis Ahora!
                </Button>
                <Button
                  onClick={() => window.open(`${APP_URL}/login`, '_blank')}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  <TreePine className="h-5 w-5 mr-2" />
                  Ya Tengo Cuenta
                </Button>
              </div>
              <p className="text-sm text-green-600 max-w-md mx-auto">
                Crear tu cuenta es completamente gratuito. Puedes explorar la comunidad y decidir cuándo plantar tu primer árbol.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaborative Trees Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center mb-16"
          >
            <Users className="h-16 w-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">Árboles Colaborativos</h2>
            <p className="text-xl md:text-2xl text-purple-700 max-w-4xl mx-auto leading-relaxed">
              Únete con amigos, familia o comunidades para plantar árboles juntos.
              <span className="block mt-2 font-semibold">Es como una "vaquita" digital para reforestar el planeta.</span>
            </p>
          </motion.div>

          {/* How Collaborative Trees Work */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-purple-200 mb-12"
          >
            <h3 className="text-3xl font-bold text-purple-800 mb-8 text-center">¿Cómo Funciona?</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-700">1</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Crea o Únete</h4>
                <p className="text-sm text-gray-600">Crea tu propio proyecto o únete a uno existente</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-700">2</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Aporta</h4>
                <p className="text-sm text-gray-600">Cada persona aporta para uno o varios árboles</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-700">3</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Completa la Meta</h4>
                <p className="text-sm text-gray-600">Entre todos llegan al objetivo de árboles</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-700">4</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">¡Se Plantan!</h4>
                <p className="text-sm text-gray-600">Los árboles se plantan y todos reciben certificado</p>
              </div>
            </div>
          </motion.div>

          {/* Two Types of Collaborative Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* User Projects */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-800">Proyectos de Usuarios</CardTitle>
                </div>
                <p className="text-blue-700 text-sm">Para círculos cercanos: amigos, familia, comunidades</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">Proyectos Personales</p>
                      <p className="text-sm text-blue-600">Crea tu propio proyecto (máx 1 activo por usuario)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">Certificado Colaborativo</p>
                      <p className="text-sm text-blue-600">Todos los participantes aparecen en el certificado</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">Aportes Flexibles</p>
                      <p className="text-sm text-blue-600">Desde $100 ARS por persona</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-2">💡 Ejemplos de uso:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Cumpleaños del abuelo: toda la familia planta árboles juntos</li>
                    <li>• Proyecto escolar: una clase entera reforesta su comunidad</li>
                    <li>• Grupo de amigos: celebran algo especial plantando árboles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Company Projects */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Building2 className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl text-orange-800">Proyectos de Empresas</CardTitle>
                </div>
                <p className="text-orange-700 text-sm">Marketing ecológico + RSE + Engagement con clientes</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-800">Proyectos Ilimitados</p>
                      <p className="text-sm text-orange-600">Las empresas pueden crear múltiples proyectos simultáneos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-800">🎁 Sorteo de Cupones</p>
                      <p className="text-sm text-orange-600">Descuentos del 10% al 50% en productos/servicios</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-800">Empresa Aporta Primero</p>
                      <p className="text-sm text-orange-600">Mínimo 30% inicial, usuarios completan el resto</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-800">Más Aportas, Más Chances</p>
                      <p className="text-sm text-orange-600">Cada $1 ARS = 1 ticket para el sorteo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm font-medium text-orange-800 mb-2">🏆 Beneficios empresariales:</p>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>• Marketing positivo con impacto real</li>
                    <li>• Recolección de datos de clientes (CRM)</li>
                    <li>• Fidelización mediante cupones</li>
                    <li>• Contenido para redes sociales</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">¿Listos para plantar juntos?</h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Únete a proyectos existentes o crea el tuyo propio. Juntos podemos hacer más por el planeta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-3 shadow-lg"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Explorar Proyectos Colaborativos
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Trees Section */}
      {trees.length > 0 && (
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-green-800 mb-4">Árboles Recientes</h2>
              <p className="text-lg text-green-700">
                Conoce a las personas que están haciendo la diferencia
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trees.slice(-6).reverse().map((tree, index) => (
                <motion.div
                  key={tree.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <TreePine className="h-6 w-6 text-green-600" />
                        {tree.isPhysical && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Físico
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-green-800 mb-1">{tree.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{tree.country}</p>
                      <p className="text-xs text-gray-500">
                        Plantado por: {tree.email}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link to="/mapa">
                  Ver Todos los Árboles
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingHome;
