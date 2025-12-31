import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Heart, Globe, Users, Target, Leaf, Award, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compromiso Real',
      description:
        'Cada árbol que se compra en nuestra plataforma se planta realmente. No es solo una promesa, es nuestra garantía.',
    },
    {
      icon: Shield,
      title: 'Transparencia Total',
      description:
        'Seguimiento completo con códigos QR, coordenadas GPS y actualizaciones del crecimiento de tu árbol.',
    },
    {
      icon: Leaf,
      title: 'Conciencia Ecológica',
      description:
        'Trabajamos con botánicos y especialistas para plantar las especies correctas en los lugares correctos.',
    },
    {
      icon: Globe,
      title: 'Impacto Global',
      description:
        'Presencia en múltiples países, colaborando con comunidades locales para maximizar el impacto positivo.',
    },
  ];

  const team = [
    {
      role: 'Botánicos',
      description: 'Seleccionan las especies ideales para cada ecosistema',
    },
    {
      role: 'Ecologistas',
      description: 'Evalúan el impacto ambiental y biodiversidad',
    },
    {
      role: 'Comunidades Locales',
      description: 'Plantan y cuidan los árboles en el terreno',
    },
    {
      role: 'Equipo Técnico',
      description: 'Desarrollan la plataforma y sistemas de seguimiento',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-500/5 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TreePine className="h-20 w-20 mx-auto mb-6 text-green-600" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-800 mb-8 leading-tight">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-green-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Somos una plataforma que conecta el deseo de ayudar con acciones reales de
              reforestación. Cada árbol cuenta, cada persona importa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-block bg-green-100 p-4 rounded-2xl mb-6">
                <Target className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-green-800 mb-6">Nuestra Misión</h2>
              <p className="text-lg text-green-700 leading-relaxed mb-4">
                En "Mi Árbol en el Mundo" creemos que cada persona puede hacer una diferencia
                tangible en la lucha contra el cambio climático y la deforestación.
              </p>
              <p className="text-lg text-green-700 leading-relaxed mb-4">
                Nuestra misión es simple pero poderosa:{' '}
                <strong>
                  hacer que plantar árboles sea accesible, transparente y significativo para todos
                </strong>
                .
              </p>
              <p className="text-lg text-green-700 leading-relaxed">
                No solo vendemos árboles, creamos conexiones emocionales entre las personas y el
                planeta, permitiendo que cada usuario sea parte activa de la solución ambiental.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white p-3 rounded-full flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Para Todos</h3>
                    <p className="text-green-700">
                      Desde individuos hasta empresas, todos pueden contribuir a la reforestación
                      global.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white p-3 rounded-full flex-shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Impacto Real</h3>
                    <p className="text-green-700">
                      Cada árbol se planta físicamente y puedes seguir su crecimiento con tecnología
                      GPS y QR.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white p-3 rounded-full flex-shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Certificación</h3>
                    <p className="text-green-700">
                      Recibe certificados digitales que comprueban tu contribución ambiental.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Nuestros Valores</h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Los principios que guían cada decisión que tomamos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full bg-white border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-center text-green-800">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-green-700 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-16"
          >
            <Users className="h-16 w-16 mx-auto mb-6 text-green-600" />
            <h2 className="text-4xl font-bold text-green-800 mb-6">Nuestro Equipo</h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Un equipo multidisciplinario comprometido con la reforestación responsable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-center text-green-800">{member.role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-green-700 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center text-white"
          >
            <Leaf className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Cómo Trabajamos</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed">
              <p>
                Trabajamos directamente con <strong>viveros locales</strong> y{' '}
                <strong>equipos de plantación</strong> en diferentes países para garantizar que cada
                árbol se plante correctamente.
              </p>
              <p>
                Nuestros <strong>botánicos y ecologistas</strong> seleccionan cuidadosamente las
                especies nativas apropiadas para cada región, considerando el clima, el suelo y el
                ecosistema local.
              </p>
              <p>
                Cada árbol plantado recibe un <strong>código QR único</strong> instalado en el
                lugar, permitiendo total trazabilidad y seguimiento del crecimiento.
              </p>
              <p className="text-green-100">
                No plantamos cualquier árbol en cualquier lado.{' '}
                <strong>Plantamos con ciencia, conciencia y compromiso ambiental.</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
