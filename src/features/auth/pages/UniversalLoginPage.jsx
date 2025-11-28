import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTree, FaBuilding, FaSeedling, FaLeaf, FaGlobe, FaHeart, FaUser } from 'react-icons/fa';
import LoginForm from '@features/auth/components/LoginForm';

const UniversalLoginPage = () => {
  const navigate = useNavigate();

  const userTypes = [
    { icon: FaUser, label: 'Usuarios', color: 'text-gray-600', bg: 'bg-gray-100' },
    { icon: FaBuilding, label: 'Empresas', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: FaSeedling, label: 'Plantadores', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: FaLeaf, label: 'Viveros', color: 'text-emerald-600', bg: 'bg-emerald-100' }
  ];

  const features = [
    {
      icon: FaGlobe,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Impacto Global',
      description: 'Rastrea tus árboles en todo el mundo'
    },
    {
      icon: FaHeart,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Comunidad Activa',
      description: 'Miles de personas plantando juntas'
    },
    {
      icon: FaSeedling,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: 'Certificados Digitales',
      description: 'Documenta tu contribución ambiental'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="flex items-center justify-center p-4 overflow-hidden relative min-h-screen">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-green-200 opacity-20">
            <FaTree size={120} />
          </div>
          <div className="absolute bottom-20 right-10 text-emerald-200 opacity-20">
            <FaLeaf size={100} />
          </div>
          <div className="absolute top-1/2 right-1/4 text-teal-200 opacity-10">
            <FaGlobe size={150} />
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding and Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block text-center lg:text-left space-y-8 p-8"
            >
              {/* Logo and Title */}
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <FaTree className="text-white text-5xl" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-green-800">
                      Mi Árbol
                    </h1>
                    <p className="text-lg text-green-600 font-medium">en el Mundo</p>
                  </div>
                </div>

                <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Únete a nuestra comunidad global comprometida con la reforestación y el cuidado del planeta
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm p-4 rounded-xl">
                    <div className={`${feature.iconBg} p-3 rounded-lg`}>
                      <feature.icon className={`${feature.iconColor} text-2xl`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LoginForm
                title="Iniciar Sesión"
                subtitle="Accede a tu cuenta para continuar"
                colorTheme="green"
                showRegisterLink={true}
                registerPath="/registro"
              >
                {/* User Types Grid (slot content via children) */}
              </LoginForm>

              {/* User Types Grid - Below the form */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 font-medium">Tipos de cuenta</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {userTypes.map((type, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`${type.bg} p-4 rounded-lg text-center hover:scale-105 transition-transform`}
                    >
                      <type.icon className={`${type.color} text-3xl mx-auto mb-2`} />
                      <p className="text-xs font-semibold text-gray-700">{type.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLoginPage;
