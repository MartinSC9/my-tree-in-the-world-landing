import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TreePine } from 'lucide-react';
import Footer from '@shared/components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const SeguridadInfantilPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Estándares de Seguridad Infantil
            </h1>
          </div>
          <p className="text-green-100">
            Última actualización:{' '}
            {new Date().toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-6 py-12"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestro Compromiso
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Mi Árbol en el Mundo tiene tolerancia cero ante cualquier forma de explotación o abuso
              sexual infantil (CSAE). Nos comprometemos a mantener un entorno seguro para todos los
              usuarios de nuestra plataforma, incluyendo la protección activa de menores de edad.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Público Objetivo
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Nuestra aplicación está diseñada para usuarios mayores de 13 años. El registro
              requiere una dirección de correo electrónico válida y la aceptación de nuestros
              términos y condiciones.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Medidas de Protección
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span>
                  <strong>Reporte de contenido:</strong> Todos los usuarios pueden reportar
                  publicaciones, comentarios, mensajes y perfiles que consideren inapropiados o que
                  involucren contenido de explotación infantil.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span>
                  <strong>Bloqueo de usuarios:</strong> Los usuarios pueden bloquear a cualquier
                  otra persona en la plataforma para evitar interacciones no deseadas.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span>
                  <strong>Moderación de contenido:</strong> Nuestro equipo revisa los reportes de
                  los usuarios y toma medidas inmediatas ante cualquier contenido que viole nuestras
                  políticas, incluyendo la eliminación del contenido y la suspensión de cuentas.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span>
                  <strong>Privacidad por defecto:</strong> Los usuarios pueden configurar su perfil
                  como privado, limitando quién puede ver su información y contactarlos.
                </span>
              </li>
            </ul>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Política contra CSAM
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Cualquier contenido relacionado con material de abuso sexual infantil (CSAM) es
              eliminado inmediatamente de la plataforma. Las cuentas involucradas son suspendidas de
              forma permanente y sin previo aviso. Reportamos todos los casos a las autoridades
              competentes de acuerdo con las leyes aplicables.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cómo Reportar</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Si encuentras contenido inapropiado o que ponga en riesgo la seguridad de menores,
              puedes reportarlo de las siguientes maneras:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">1.</span>
                <span>
                  Dentro de la app, utiliza el botón de "Reportar" disponible en publicaciones,
                  comentarios, mensajes y perfiles de usuario.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">2.</span>
                <span>
                  Envía un correo electrónico a{' '}
                  <a
                    href="mailto:seguridad@miarbolenelmundo.com"
                    className="text-green-600 hover:underline"
                  >
                    seguridad@miarbolenelmundo.com
                  </a>{' '}
                  con los detalles del incidente.
                </span>
              </li>
            </ul>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cumplimiento Legal
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Mi Árbol en el Mundo cumple con todas las leyes aplicables de protección infantil,
              incluyendo la Ley de Protección de la Privacidad Infantil en Internet (COPPA) de los
              EE.UU. y el Reglamento General de Protección de Datos (GDPR) de la UE. Cooperamos
              activamente con las autoridades regionales y nacionales en la denuncia e investigación
              de cualquier caso de explotación infantil.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contacto</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Para consultas relacionadas con la seguridad infantil en nuestra plataforma, contacta
              a nuestro equipo en{' '}
              <a
                href="mailto:seguridad@miarbolenelmundo.com"
                className="text-green-600 hover:underline"
              >
                seguridad@miarbolenelmundo.com
              </a>
              .
            </p>
          </motion.section>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default SeguridadInfantilPage;
