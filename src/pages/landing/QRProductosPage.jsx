import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Building2, TreePine, ArrowRight, CheckCircle, Gift, ShoppingBag, Smartphone, Award, TrendingUp, Users, Package } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import Footer from '@shared/components/layout/Footer';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const QRProductosPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <QrCode className="h-20 w-20 mx-auto mb-6 text-white/90" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
              QR en Productos de Empresas
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100 mb-8">
              Tus clientes escanean, participan y pueden ganar un árbol gratis
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate('/contacto')}
                size="lg"
                className="bg-white hover:bg-gray-50 text-emerald-600 shadow-xl hover:shadow-2xl px-10 py-6 text-lg"
              >
                <Building2 className="h-6 w-6 mr-3" />
                Quiero ser Partner
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Concepto Principal */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              ¿Cómo Funciona?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Las empresas asociadas incluyen en sus productos un sello con código QR.
              Los consumidores que escanean participan para ganar árboles gratis.
            </motion.p>
          </motion.div>

          {/* Flujo Visual */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: ShoppingBag,
                title: 'Cliente compra producto',
                desc: 'El producto tiene el sello "Mi Árbol en el Mundo" con código QR',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Smartphone,
                title: 'Escanea el código QR',
                desc: 'Accede a nuestra plataforma y participa automáticamente',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: TreePine,
                title: '¡Puede ganar un árbol!',
                desc: 'Sorteo de árboles entre los participantes o sistema de puntos',
                color: 'bg-green-100 text-green-600'
              }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6`}>
                      <step.icon className="h-10 w-10" />
                    </div>
                    <div className="text-4xl font-bold text-gray-300 dark:text-gray-600 mb-2">{i + 1}</div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* El Sello */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                El Sello Oficial
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Cada empresa partner recibe sellos oficiales con código QR único para incluir en sus productos.
                El diseño es atractivo y genera curiosidad en los consumidores.
              </p>
              <div className="space-y-4">
                {[
                  'Diseño premium que destaca en el packaging',
                  'QR único trackeable por producto o lote',
                  'Mensaje claro: "Escaneá y ganá un árbol"',
                  'Variantes: premium, compacto y etiqueta adhesiva'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-2xl p-8 border-4 border-emerald-200 dark:border-emerald-700 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TreePine className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">MI ÁRBOL EN EL MUNDO</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-600 rounded-2xl p-6 mb-4">
                    <QrCode className="h-32 w-32 mx-auto text-gray-800 dark:text-gray-200" />
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-white mb-2">ESCANEÁ Y GANÁ</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">UN ÁRBOL GRATIS</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">#PlantemosJuntos</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Beneficios para cada parte */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Beneficios para Todos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              Un modelo win-win-win
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Empresa */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-blue-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4">Para la Empresa</h3>
                  <ul className="space-y-3">
                    {[
                      'Marketing verde genuino (no greenwashing)',
                      'Diferenciación en góndola',
                      'Conexión emocional con el consumidor',
                      'Métricas de engagement reales',
                      'RSE verificable'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consumidor */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-green-200 dark:border-gray-700 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-800">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4">Para el Consumidor</h3>
                  <ul className="space-y-3">
                    {[
                      'Posibilidad de ganar algo valioso',
                      'Participar en causa ambiental sin costo',
                      'Experiencia interactiva con el producto',
                      'Descubrir nuestra plataforma',
                      'Sentirse parte del cambio'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Planeta */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-emerald-200 dark:border-gray-700 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-800">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                    <TreePine className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">Para el Planeta</h3>
                  <ul className="space-y-3">
                    {[
                      'Más árboles plantados',
                      'Consumo consciente promovido',
                      'Empresas comprometidas con el ambiente',
                      'Comunidad ambiental creciente',
                      'Impacto real y medible'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
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

      {/* Qué incluye el Partnership */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Award className="h-14 w-14 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              ¿Qué Incluye ser Partner?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: QrCode, title: 'Sello oficial con QR', desc: 'Diseño premium para tu packaging' },
              { icon: TrendingUp, title: 'Dashboard de métricas', desc: 'Escaneos, participantes y ganadores en tiempo real' },
              { icon: Award, title: 'Certificado de impacto', desc: 'Documento verificable de tu aporte ambiental' },
              { icon: Building2, title: 'Mención en la app', desc: 'Tu empresa aparece como "Empresa Amiga del Bosque"' },
              { icon: Package, title: 'Variantes de sello', desc: 'Premium, compacto o etiqueta según tu producto' },
              { icon: Users, title: 'Soporte dedicado', desc: 'Equipo disponible para ayudarte' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Empresas Target */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              ¿Qué Empresas Pueden Participar?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ideal para empresas que quieren diferenciarse con un compromiso ambiental real
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              'Alimentos orgánicos',
              'Bebidas naturales',
              'Cosméticos naturales',
              'Ropa sustentable',
              'Cafeterías',
              'Restaurantes',
              'Supermercados',
              'Librerías',
              'Papelerías',
              'Tiendas eco-friendly'
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-full text-emerald-700 dark:text-emerald-400 font-medium"
              >
                {category}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Building2 className="h-16 w-16 mx-auto mb-6 text-white/90" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Tu Empresa Quiere Ser Partner?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Contactanos para conocer los planes disponibles y empezar a incluir el sello en tus productos.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/contacto')}
                size="lg"
                className="bg-white hover:bg-gray-50 text-emerald-600 shadow-xl hover:shadow-2xl px-12 py-7 text-xl font-semibold"
              >
                <Building2 className="h-6 w-6 mr-3" />
                Contactar Ahora
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button
                onClick={() => navigate('/empresas')}
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 px-12 py-7 text-xl"
              >
                Ver Programa Empresarial
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QRProductosPage;
