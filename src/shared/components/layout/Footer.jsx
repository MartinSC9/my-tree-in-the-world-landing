import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TreePine className="h-8 w-8" />
              <span className="text-xl font-bold">Mi Árbol en el Mundo</span>
            </div>
            <p className="text-green-100 mb-4">
              Ayudamos a reforestar el planeta gracias al compromiso de personas como vos.
              Cada árbol que comprás se planta realmente en el lugar elegido.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/empresas" className="text-green-200 hover:text-white transition-colors">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link to="/mapa" className="text-green-200 hover:text-white transition-colors">
                  Mapa Global
                </Link>
              </li>
              <li>
                <Link to="/registro" className="text-green-200 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-2 text-green-200">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@miarbolenelmundo.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Córdoba, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} Mi Árbol en el Mundo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
