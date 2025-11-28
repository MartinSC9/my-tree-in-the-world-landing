import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Globe } from 'lucide-react';
import { FaTree, FaMapMarkedAlt, FaCertificate, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { useAuth } from '@core/contexts/AuthContext';
import PlantTreeWizard from '@features/trees/components/PlantTreeWizard';

const PlantTreePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Componente para mostrar información cuando no hay usuario logueado
  const SystemInfoSection = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl mb-6">
          <FaTree className="text-white text-6xl" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
          Planta tu Árbol
        </h1>
        <p className="text-2xl text-green-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Únete a nuestra misión de reforestar el planeta. Cada árbol cuenta para un futuro más verde.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            <LogIn className="h-6 w-6 mr-2" />
            Iniciar Sesión
          </Button>
          <Button
            onClick={() => navigate('/registro')}
            variant="outline"
            className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-10 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlus className="h-6 w-6 mr-2" />
            Registrarse
          </Button>
        </div>
      </motion.div>

      {/* Features Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-2xl border-0 hover:shadow-3xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-green-50/50 h-full">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 w-20 h-20 mx-auto mb-6 shadow-lg">
                <FaTree className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Plantación de Árboles Reales
              </h3>
              <p className="text-green-600 leading-relaxed">
                Planta árboles físicos reales por <span className="font-bold">$24.000 ARS</span>. Tu contribución ayuda a reforestar el planeta de manera tangible y verificable.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 hover:shadow-3xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/50 h-full">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 w-20 h-20 mx-auto mb-6 shadow-lg">
                <FaMapMarkedAlt className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Ubicación Global
              </h3>
              <p className="text-blue-600 leading-relaxed">
                Elige cualquier ubicación en el mundo para tu árbol. Nuestro mapa interactivo te permite seleccionar el lugar perfecto.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-2xl border-0 hover:shadow-3xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50/50 h-full">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 w-20 h-20 mx-auto mb-6 shadow-lg">
                <FaCertificate className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                Certificado Digital
              </h3>
              <p className="text-purple-600 leading-relaxed">
                Recibe un certificado personalizado que demuestra tu contribución al medio ambiente y tu compromiso con el planeta.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* How it Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <CardContent className="p-10 md:p-14">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">
                ¿Cómo Funciona Nuestro Sistema?
              </h2>
              <p className="text-lg text-green-600">
                En solo 6 pasos simples, puedes contribuir a la reforestación global
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { num: 1, title: 'Regístrate o Inicia Sesión', desc: 'Crea tu cuenta gratuita para acceder a todas las funcionalidades de plantación.' },
                { num: 2, title: 'Selecciona la Ubicación', desc: 'Usa nuestro mapa interactivo para elegir dónde quieres que crezca tu árbol.' },
                { num: 3, title: 'Personaliza tu Árbol', desc: 'Dale un nombre especial y añade un mensaje personal a tu árbol.' },
                { num: 4, title: 'Árbol Real', desc: 'Cada árbol que plantas es un árbol físico real que será plantado en la ubicación seleccionada.' },
                { num: 5, title: 'Realiza el Pago', desc: 'Completa tu contribución de forma segura y rápida.' },
                { num: 6, title: 'Recibe tu Certificado', desc: 'Obtén tu certificado digital y sigue el progreso de tu árbol.' }
              ].map((step) => (
                <div key={step.num} className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-green-800 mb-2">{step.title}</h4>
                    <p className="text-green-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
          <CardContent className="p-10 md:p-14">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-800 mb-4">
                Beneficios de Nuestro Sistema
              </h2>
              <p className="text-lg text-blue-600">
                Impacto real y medible en el medio ambiente
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center bg-white/70 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaCheckCircle className="text-white text-4xl" />
                </div>
                <h4 className="font-bold text-xl text-green-800 mb-3">Impacto Ambiental Real</h4>
                <p className="text-green-600 leading-relaxed">Cada árbol contribuye a la captura de CO₂, producción de oxígeno y conservación de la biodiversidad.</p>
              </div>
              <div className="text-center bg-white/70 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaMapMarkedAlt className="text-white text-4xl" />
                </div>
                <h4 className="font-bold text-xl text-blue-800 mb-3">Transparencia Total</h4>
                <p className="text-blue-600 leading-relaxed">Rastrea la ubicación exacta de tu árbol y su progreso a través de nuestro sistema.</p>
              </div>
              <div className="text-center bg-white/70 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="text-white text-4xl" />
                </div>
                <h4 className="font-bold text-xl text-purple-800 mb-3">Comunidad Global</h4>
                <p className="text-purple-600 leading-relaxed">Únete a miles de personas comprometidas con la reforestación mundial.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft className="mr-1" />
            Volver
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mostrar información del sistema si no hay usuario logueado */}
          {!user ? (
            <SystemInfoSection />
          ) : (
            /* Wizard de plantación para usuarios registrados */
            <>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
                  Planta tu Árbol
                </h1>
                <p className="text-2xl text-green-600 max-w-3xl mx-auto leading-relaxed">
                  Sigue los pasos y ayuda al planeta. Cada árbol hace la diferencia.
                </p>
              </div>

              <PlantTreeWizard />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PlantTreePage;