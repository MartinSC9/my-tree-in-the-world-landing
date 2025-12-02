import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@core/contexts/AuthContext';
import { TreePine, Menu, X, Home, Gift, Sprout, Globe, User, Users, LogOut, LogIn, UserPlus, Settings, ShoppingCart, Bell, ChevronDown } from 'lucide-react';
import { APP_URL } from '@core/config/app.config';




const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Funci�n para scroll al inicio
  const scrollToTop = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const { user, logout, getRedirectPath } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  // Función para obtener la ruta de "Plantar Árbol" según el usuario
  const getPlantTreePath = () => {
    if (!user) {
      return '/registro'; // Si no está autenticado, llevar a registro
    }
    // Si está autenticado y es usuario regular, llevar a su página de plantar árbol
    if (user.role === 'user') {
      return `/usuario/${user.id}/plantararbol`;
    }
    // Para otros roles, llevar a la página genérica o su dashboard
    return getRedirectPath(user.role);
  };

  // Función para obtener la ruta del panel según el usuario
  const getDashboardPath = () => {
    if (!user) return '/';

    // Para usuarios regulares, llevar a la sección de Perfil
    if (user.role === 'user') {
      return `/usuario/${user.id}/perfil`;
    }

    // Para otros roles, usar la ruta del dashboard correspondiente
    return getRedirectPath(user.role);
  };

  const navigationItems = [
    { name: 'Inicio', path: '/', icon: Home, isInternal: true },
    { name: 'Sorteos', path: '/sorteos', icon: Gift, isInternal: true },
    { name: 'Plantar Árbol', path: `${APP_URL}/registro`, icon: Sprout, isInternal: false },
    { name: 'Mapa Global', path: '/mapa', icon: Globe, isInternal: true },
  ];

  return (
    <>
      <nav
        className="bg-white/95 backdrop-blur-md border-b border-green-200 sticky top-0 z-[1000] shadow-sm"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="w-full px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2 flex-shrink-0" aria-label="Ir a página de inicio">
              <TreePine className="h-7 w-7 text-green-600" />
              <span className="text-lg font-bold text-green-800 hidden xl:block">Mi Árbol en el Mundo</span>
              <span className="text-lg font-bold text-green-800 xl:hidden hidden md:block">Mi Árbol</span>
            </Link>

            {/* Desktop Navigation - Solo visible en landing (sin autenticación) */}
            {!user && (
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl">
                  {navigationItems.map((item) => (
                    item.isInternal ? (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={item.path === "/" ? scrollToTop : undefined}
                        className="text-green-700 hover:text-green-900 hover:bg-green-50 transition-all flex items-center gap-1.5 font-medium px-3 py-2 rounded-lg"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ) : (
                      <button
                        key={item.name}
                        onClick={() => window.open(item.path, '_blank')}
                        className="text-green-700 hover:text-green-900 hover:bg-green-50 transition-all flex items-center gap-1.5 font-medium px-3 py-2 rounded-lg"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.name}</span>
                      </button>
                    )
                  ))}
              </div>
            )}

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {user ? (
                <>
                  {/* Botón de notificaciones */}
                  <button
                    onClick={() => navigate(`/usuario/${user.id}/notificaciones`)}
                    className="relative p-2 hover:bg-green-50 rounded-lg transition-colors group"
                    aria-label="Notificaciones"
                  >
                    <Bell className="h-5 w-5 text-green-700 group-hover:text-green-900" />
                    {/* Badge de notificaciones nuevas (opcional, puedes activarlo más tarde) */}
                    {/* <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span> */}
                  </button>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm group-hover:bg-green-700 transition-colors">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-green-800 max-w-[120px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="h-4 w-4 text-green-700 group-hover:text-green-900 transition-colors" />
                    </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate(getDashboardPath());
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            {user.role === 'user' ? 'Ver mi perfil' : 'Ver panel'}
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => window.open(`${APP_URL}/login`, '_blank')}
                    variant="ghost"
                    size="sm"
                    className="text-green-700 hover:text-green-900 hover:bg-green-50"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    <span className="hidden xl:inline">Iniciar Sesión</span>
                    <span className="xl:hidden">Entrar</span>
                  </Button>
                  <Button
                    onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Registro
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-green-50 transition-colors flex-shrink-0"
              aria-label="Abrir menú de navegación"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-green-700" />
              ) : (
                <Menu className="h-6 w-6 text-green-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[999] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-[1000] lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-2">
                    <TreePine className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-bold text-green-800">Menú</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Cerrar menú"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* User Profile Section */}
                {user ? (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-green-700 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleNavigation(getDashboardPath())}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {user.role === 'user' ? 'Ver mi perfil' : 'Mi Panel'}
                      </Button>
                      <Button
                        onClick={() => handleNavigation(`/usuario/${user.id}/notificaciones`)}
                        variant="outline"
                        className="border-green-600 text-green-700 hover:bg-green-50"
                        size="sm"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notificaciones
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 space-y-2">
                    <Button
                      onClick={() => window.open(`${APP_URL}/login`, '_blank')}
                      variant="outline"
                      className="w-full border-green-600 text-green-700 hover:bg-green-50"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                    <Button
                      onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Registrarse
                    </Button>
                  </div>
                )}

                {/* Navigation Links - Solo visible en landing (sin autenticación) */}
                {!user && (
                  <nav className="space-y-1">
                      {navigationItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (item.isInternal) {
                              handleNavigation(item.path);
                            } else {
                              window.open(item.path, '_blank');
                              setIsMenuOpen(false);
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-green-50 hover:text-green-900 transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      ))}
                  </nav>
                )}

                {/* Logout Button */}
                {user && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

