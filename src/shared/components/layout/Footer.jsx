import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-emerald-900 dark:from-gray-900 dark:to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripcion */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TreePine className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold">Mi Árbol en el Mundo</span>
            </div>
            <p className="text-green-100 dark:text-gray-300 mb-4">
              Ayudamos a reforestar el planeta gracias al compromiso de personas como tú.
              Cada árbol que compras se planta realmente en el lugar elegido.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rapidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/empresas" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link to="/mapa" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                  Mapa Global
                </Link>
              </li>
              <li>
                <Link to="/registro" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors">
                  Ingresar a la App
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-2 text-green-200 dark:text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@miarbolenelmundo.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Córdoba, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-green-700 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-200 dark:text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} Mi Árbol en el Mundo. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/terminos" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors text-sm">
                Términos y Condiciones
              </Link>
              <Link to="/privacidad" className="text-green-200 dark:text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
