import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TreePine } from 'lucide-react';
import Footer from '@shared/components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TerminosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Términos y Condiciones
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
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TreePine className="h-6 w-6 text-green-600" />
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Al acceder y utilizar la plataforma "Mi Árbol en el Mundo" (en adelante, "la Plataforma"),
              usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguna
              parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Descripción del Servicio</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Mi Árbol en el Mundo es una plataforma que permite a los usuarios:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Comprar árboles reales que serán plantados en ubicaciones verificadas</li>
              <li>Recibir certificados digitales de plantación</li>
              <li>Acceder a información sobre sus árboles mediante códigos QR</li>
              <li>Participar en proyectos colaborativos de reforestación</li>
              <li>Seguir el crecimiento y estado de sus árboles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Registro de Usuario</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Para utilizar ciertos servicios de la Plataforma, deberá crear una cuenta proporcionando
              información precisa y completa. Usted es responsable de:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Mantener la confidencialidad de su contraseña</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
              <li>Asegurarse de que la información de su cuenta esté actualizada</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Compra de Árboles</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Al realizar una compra en la Plataforma:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>El pago se procesa a través de proveedores seguros (MercadoPago)</li>
              <li>Los precios están expresados en Pesos Argentinos (ARS) e incluyen IVA</li>
              <li>La plantación se realizará en un plazo de 30 a 90 días según la ubicación</li>
              <li>Recibirá confirmación por correo electrónico con los detalles de su árbol</li>
              <li>El certificado digital estará disponible una vez completada la plantación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Política de Reembolsos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dado que nuestro servicio implica la plantación física de árboles:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Las solicitudes de reembolso deben realizarse dentro de las 48 horas posteriores a la compra</li>
              <li>No se aceptan reembolsos una vez iniciado el proceso de plantación</li>
              <li>En caso de que un árbol no sobreviva durante el primer año, nos comprometemos a plantar uno nuevo sin costo adicional</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Propiedad Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo el contenido de la Plataforma, incluyendo textos, gráficos, logos, íconos, imágenes,
              clips de audio y software, es propiedad de Mi Árbol en el Mundo o de sus proveedores de
              contenido y está protegido por las leyes de propiedad intelectual argentinas e internacionales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Uso Aceptable</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Los usuarios se comprometen a no:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Usar la Plataforma para fines ilegales o no autorizados</li>
              <li>Interferir con el funcionamiento de la Plataforma</li>
              <li>Intentar acceder a áreas restringidas del sistema</li>
              <li>Compartir contenido ofensivo, difamatorio o que infrinja derechos de terceros</li>
              <li>Utilizar bots, scripts o herramientas automatizadas sin autorización</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitación de Responsabilidad</h2>
            <p className="text-gray-600 leading-relaxed">
              Mi Árbol en el Mundo no será responsable por daños indirectos, incidentales, especiales
              o consecuentes que resulten del uso o la imposibilidad de usar la Plataforma.
              Hacemos nuestro mejor esfuerzo para garantizar la supervivencia de los árboles plantados,
              pero no podemos garantizar resultados específicos debido a factores ambientales externos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Modificaciones</h2>
            <p className="text-gray-600 leading-relaxed">
              Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
              Los cambios entrarán en vigor inmediatamente después de su publicación en la Plataforma.
              El uso continuado de nuestros servicios después de dichos cambios constituye su aceptación
              de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Ley Aplicable</h2>
            <p className="text-gray-600 leading-relaxed">
              Estos Términos y Condiciones se rigen por las leyes de la República Argentina.
              Cualquier disputa que surja en relación con estos términos se someterá a la
              jurisdicción exclusiva de los tribunales ordinarios de la Ciudad de Córdoba, Argentina.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contacto</h2>
            <p className="text-gray-600 leading-relaxed">
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <ul className="text-gray-600 mt-2 space-y-1">
              <li><strong>Email:</strong> info@miarbolenelmundo.com</li>
              <li><strong>Teléfono:</strong> +54 11 1234-5678</li>
              <li><strong>Dirección:</strong> Córdoba, Argentina</li>
            </ul>
          </section>

        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default TerminosPage;
