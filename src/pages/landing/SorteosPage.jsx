import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Users, Ticket, Trophy, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';



const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const SorteosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-90" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center text-white"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Gift className="h-20 w-20 mx-auto text-yellow-300" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6">
              Sorteos de Cupones
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Participa en proyectos colaborativos de empresas y gana cupones de descuento.
              <span className="block mt-2 font-semibold text-yellow-300">Mientras mas aportas, mas chances tenes de ganar.</span>
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="bg-white hover:bg-gray-100 text-purple-600 font-semibold px-10 py-6 text-lg shadow-xl"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Ver Sorteos Activos
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-800 mb-4">
              Cómo Funcionan los Sorteos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Las empresas crean proyectos colaborativos con sorteos de cupones para sus clientes.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Users,
                step: '1',
                title: 'Empresa Crea Proyecto',
                desc: 'Una empresa crea un proyecto colaborativo y aporta el 30% inicial.',
                color: 'purple'
              },
              {
                icon: Ticket,
                step: '2',
                title: 'Tu Participas',
                desc: 'Aportas lo que quieras. Cada $1 ARS = 1 ticket para el sorteo.',
                color: 'pink'
              },
              {
                icon: Trophy,
                step: '3',
                title: 'Se Completa el Proyecto',
                desc: 'Cuando se alcanza la meta, se plantan los arboles.',
                color: 'orange'
              },
              {
                icon: Gift,
                step: '4',
                title: 'Sorteo de Cupones',
                desc: 'Se sortean cupones de descuento entre los participantes.',
                color: 'yellow'
              }
            ].map((item, i) => {
              const colors = {
                purple: 'bg-purple-100 text-purple-600 border-purple-200',
                pink: 'bg-pink-100 text-pink-600 border-pink-200',
                orange: 'bg-orange-100 text-orange-600 border-orange-200',
                yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
              };
              return (
                <motion.div key={i} variants={fadeInUp} className="text-center">
                  <div className={`w-20 h-20 rounded-2xl ${colors[item.color]} border-2 flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="h-10 w-10" />
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <span className="inline-block bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                      Paso {item.step}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Premios */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-800 mb-4">
              Premios Disponibles
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              Cada empresa configura sus propios premios y descuentos.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                discount: '10%',
                title: 'Tercer Premio',
                desc: 'Cupon de descuento del 10% en productos de la empresa.',
                color: 'from-amber-400 to-yellow-500',
                icon: '🥉'
              },
              {
                discount: '25%',
                title: 'Segundo Premio',
                desc: 'Cupon de descuento del 25% en productos de la empresa.',
                color: 'from-gray-300 to-gray-400',
                icon: '🥈'
              },
              {
                discount: '50%',
                title: 'Primer Premio',
                desc: 'Cupon de descuento del 50% en productos de la empresa.',
                color: 'from-yellow-400 to-amber-500',
                icon: '🥇'
              }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-r ${item.color} p-6 text-center`}>
                    <span className="text-5xl">{item.icon}</span>
                    <div className="text-4xl font-bold text-white mt-2">{item.discount}</div>
                    <div className="text-white/90 font-medium">DESCUENTO</div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Mas Aportas = Mas Chances</h3>
                <p className="text-gray-600">
                  El sistema es justo: cada peso que aportas es un ticket para el sorteo.
                  Si aportas $500, tenes 500 tickets. Si otro aporta $100, tiene 100 tickets.
                  Cuanto mas aportas, mas probabilidades tenes de ganar.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-800 mb-4">
              Todos Ganan
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-800">
                    <Users className="h-6 w-6" />
                    Para Participantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Ayudas a plantar arboles reales',
                      'Participas en sorteos de cupones',
                      'Apareces en el certificado del arbol',
                      'Apoyas el medio ambiente',
                      'Obtienes descuentos en productos'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-purple-700">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-800">
                    <Trophy className="h-6 w-6" />
                    Para Empresas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Marketing verde con impacto real',
                      'Fidelizacion de clientes',
                      'Engagement con la comunidad',
                      'Mejora de imagen corporativa',
                      'Certificacion de RSE'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-orange-700">
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Gift className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6">
              Participa en un Sorteo Hoy
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-purple-100 mb-8">
              Planta arboles, gana cupones, ayuda al planeta.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                size="lg"
                className="bg-white hover:bg-gray-100 text-purple-600 font-semibold px-10 py-6 text-lg shadow-xl"
              >
                Ver Sorteos Disponibles
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SorteosPage;
