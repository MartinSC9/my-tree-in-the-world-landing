import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TreePine } from 'lucide-react';
import Footer from '@shared/components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PrivacidadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-green-100">
            Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <TreePine className="h-6 w-6 text-green-600" />
              1. Introducción
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              En Mi Árbol en el Mundo, nos comprometemos a proteger su privacidad. Esta Política de
              Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información
              personal cuando utiliza nuestra plataforma y servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2. Información que Recopilamos</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Recopilamos los siguientes tipos de información:
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">2.1 Información proporcionada por usted:</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4 mb-4">
              <li>Nombre y apellido</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Información de facturación y pago</li>
              <li>Preferencias de ubicación para plantación</li>
              <li>Mensajes y comunicaciones que nos envía</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">2.2 Información recopilada automáticamente:</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Dirección IP y tipo de navegador</li>
              <li>Información del dispositivo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">3. Uso de la Información</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Utilizamos su información para:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Procesar sus compras y gestionar su cuenta</li>
              <li>Enviarle actualizaciones sobre sus árboles y certificados</li>
              <li>Comunicarnos con usted sobre nuestros servicios</li>
              <li>Mejorar nuestra plataforma y experiencia de usuario</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
              <li>Prevenir fraudes y actividades no autorizadas</li>
              <li>Enviar comunicaciones de marketing (con su consentimiento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">4. Compartir Información</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Podemos compartir su información con:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a operar la plataforma (procesadores de pago, servicios de hosting, etc.)</li>
              <li><strong>Viveros y plantadores:</strong> información necesaria para coordinar la plantación de sus árboles</li>
              <li><strong>Autoridades:</strong> cuando sea requerido por ley o para proteger nuestros derechos</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              <strong>No vendemos su información personal a terceros.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">5. Cookies y Tecnologías de Seguimiento</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Utilizamos cookies para:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Mantener su sesión iniciada</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Personalizar su experiencia</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la
              funcionalidad de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">6. Seguridad de los Datos</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información,
              incluyendo:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4 mt-4">
              <li>Encriptación SSL/TLS para todas las transmisiones de datos</li>
              <li>Almacenamiento seguro con acceso restringido</li>
              <li>Auditorías de seguridad periódicas</li>
              <li>Capacitación del personal en protección de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">7. Sus Derechos</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              De acuerdo con la Ley de Protección de Datos Personales N° 25.326, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Acceso:</strong> solicitar una copia de sus datos personales</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de sus datos</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos para fines específicos</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              Para ejercer estos derechos, contáctenos a través de los medios indicados al final de esta política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">8. Retención de Datos</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Conservamos su información personal durante el tiempo que sea necesario para:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4 mt-4">
              <li>Mantener su cuenta activa y proporcionarle nuestros servicios</li>
              <li>Cumplir con obligaciones legales y fiscales (mínimo 10 años para datos de facturación)</li>
              <li>Resolver disputas y hacer cumplir nuestros acuerdos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">9. Menores de Edad</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
              intencionalmente información de menores. Si descubrimos que hemos recopilado
              datos de un menor sin el consentimiento de sus padres o tutores, eliminaremos
              esa información de inmediato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">10. Transferencias Internacionales</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Sus datos pueden ser transferidos y procesados en servidores ubicados fuera de Argentina.
              Cuando esto ocurra, nos aseguraremos de que existan las garantías adecuadas para
              proteger su información de acuerdo con esta política y las leyes aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">11. Cambios en esta Política</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos
              sobre cambios significativos mediante un aviso en nuestra plataforma o por correo
              electrónico. Le recomendamos revisar esta política periódicamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">12. Contacto</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos,
              puede contactarnos:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 mt-2 space-y-1">
              <li><strong>Email:</strong> privacidad@miarbolenelmundo.com</li>
              <li><strong>Teléfono:</strong> +54 11 1234-5678</li>
              <li><strong>Dirección:</strong> Córdoba, Argentina</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              También puede presentar una denuncia ante la Agencia de Acceso a la Información
              Pública (AAIP) si considera que sus derechos han sido vulnerados.
            </p>
          </section>

        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default PrivacidadPage;
