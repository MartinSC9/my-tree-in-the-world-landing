import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@core/contexts/AuthContext';
import { useTheme } from '@core/contexts/ThemeContext';
import {
  TreePine,
  Menu,
  X,
  Home,
  Gift,
  Sprout,
  Globe,
  User,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  ShoppingCart,
  Bell,
  ChevronDown,
  QrCode,
  Share2,
  Store,
  Shovel,
  Tag,
  Sun,
  Moon,
} from 'lucide-react';
import { APP_URL } from '@core/config/app.config';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  // Scroll al inicio
  const scrollToTop = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { user, logout, getRedirectPath } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false);
  const [isSociosDropdownOpen, setIsSociosDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const programsDropdownRef = useRef(null);
  const sociosDropdownRef = useRef(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (programsDropdownRef.current && !programsDropdownRef.current.contains(event.target)) {
        setIsProgramsDropdownOpen(false);
      }
      if (sociosDropdownRef.current && !sociosDropdownRef.current.contains(event.target)) {
        setIsSociosDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen || isProgramsDropdownOpen || isSociosDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isProgramsDropdownOpen, isSociosDropdownOpen]);

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

  // Ruta de "Plantar Arbol" segun el usuario
  const getPlantTreePath = () => {
    if (!user) {
      return '/registro';
    }
    if (user.role === 'user') {
      return `/usuario/${user.id}/plantararbol`;
    }
    return getRedirectPath(user.role);
  };

  // Ruta del panel segun el usuario
  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'user') {
      return `/usuario/${user.id}/perfil`;
    }
    return getRedirectPath(user.role);
  };

  const navigationItems = [
    { name: 'Inicio', path: '/', icon: Home, isInternal: true },
    { name: 'Mapa Global', path: '/mapa', icon: Globe, isInternal: true },
  ];

  const programsItems = [
    { name: 'Sorteos', path: '/sorteos', icon: Gift, desc: 'Participa y gana arboles' },
    { name: 'Referidos', path: '/referidos', icon: Share2, desc: 'Invita amigos y gana puntos' },
    {
      name: 'QR Empresas',
      path: '/qr-productos',
      icon: QrCode,
      desc: 'Programa para empresas partner',
    },
  ];

  const sociosItems = [
    { name: 'Viveros', path: '/viveros', icon: Store, desc: 'Vende tus arboles con nosotros' },
    {
      name: 'Plantadores',
      path: '/plantadores',
      icon: Shovel,
      desc: 'Gana dinero plantando arboles',
    },
    {
      name: 'Chapistas',
      path: '/chapistas',
      icon: Tag,
      desc: 'Fabrica chapas QR para arboles',
    },
  ];

  return (
    <>
      <nav
        className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-green-200 dark:border-gray-800 sticky top-0 z-[1000] shadow-sm"
        role="navigation"
        aria-label="Navegacion principal"
      >
        <div className="w-full px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center space-x-2 flex-shrink-0"
              aria-label="Ir a pagina de inicio"
            >
              <TreePine className="h-7 w-7 text-green-600 dark:text-emerald-400" />
              <span className="text-lg font-bold text-green-800 dark:text-white hidden xl:block">
                Mi Árbol en el Mundo
              </span>
              <span className="text-lg font-bold text-green-800 dark:text-white xl:hidden hidden md:block">
                Mi Árbol
              </span>
            </Link>

            {/* Desktop Navigation - Solo visible en landing (sin autenticacion) */}
            {!user && (
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl">
                {navigationItems.map((item) =>
                  item.isInternal ? (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={item.path === '/' ? scrollToTop : undefined}
                      className="text-green-700 dark:text-gray-300 hover:text-green-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-gray-800 transition-all flex items-center gap-1.5 font-medium px-3 py-2 rounded-lg"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => window.open(item.path, '_blank')}
                      className="text-green-700 dark:text-gray-300 hover:text-green-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-gray-800 transition-all flex items-center gap-1.5 font-medium px-3 py-2 rounded-lg"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </button>
                  )
                )}

                {/* Dropdown Programas */}
                <div className="relative" ref={programsDropdownRef}>
                  <button
                    onClick={() => setIsProgramsDropdownOpen(!isProgramsDropdownOpen)}
                    className="text-green-700 dark:text-gray-300 hover:text-green-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-gray-800 transition-all flex items-center gap-1.5 font-medium px-3 py-2 rounded-lg"
                  >
                    <Gift className="h-4 w-4" />
                    <span className="text-sm">Programas</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isProgramsDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProgramsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        {programsItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsProgramsDropdownOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dropdown Socios */}
                <div className="relative" ref={sociosDropdownRef}>
                  <button
                    onClick={() => setIsSociosDropdownOpen(!isSociosDropdownOpen)}
                    className="text-green-700 dark:text-gray-300 hover:text-green-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-gray-800 transition-all flex items-center gap-1.5 font-medium px-3 py-2 rounded-lg"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Socios</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isSociosDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isSociosDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        {sociosItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsSociosDropdownOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
                aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {user ? (
                <>
                  {/* Boton de notificaciones */}
                  <button
                    onClick={() => navigate(`/usuario/${user.id}/notificaciones`)}
                    className="relative p-2 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                    aria-label="Notificaciones"
                  >
                    <Bell className="h-5 w-5 text-green-700 dark:text-gray-300 group-hover:text-green-900 dark:group-hover:text-white" />
                  </button>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-600 dark:bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm group-hover:bg-green-700 dark:group-hover:bg-emerald-500 transition-colors">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-green-800 dark:text-white max-w-[120px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="h-4 w-4 text-green-700 dark:text-gray-300 group-hover:text-green-900 dark:group-hover:text-white transition-colors" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate(getDashboardPath());
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              {user.role === 'user' ? 'Ver mi perfil' : 'Ver panel'}
                            </button>
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <LogOut className="h-4 w-4" />
                              Cerrar sesion
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => window.open(`${APP_URL}/`, '_blank')}
                  size="sm"
                  className="bg-brand hover:bg-brand-dark text-white"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Entrar
                </Button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
                aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                aria-label="Abrir menu de navegacion"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-green-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-green-700 dark:text-gray-300" />
                )}
              </button>
            </div>
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
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-[1000] lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-2">
                    <TreePine className="h-6 w-6 text-green-600 dark:text-emerald-400" />
                    <span className="text-lg font-bold text-green-800 dark:text-white">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Cerrar menu"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* User Profile Section */}
                {user ? (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-green-600 dark:bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-white">
                          {user.username}
                        </p>
                        <p className="text-xs text-green-700 dark:text-gray-400 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleNavigation(getDashboardPath())}
                        className="bg-brand hover:bg-brand-dark text-white"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {user.role === 'user' ? 'Ver mi perfil' : 'Mi Panel'}
                      </Button>
                      <Button
                        onClick={() => handleNavigation(`/usuario/${user.id}/notificaciones`)}
                        variant="outline"
                        className="border-green-600 dark:border-emerald-600 text-green-700 dark:text-emerald-400 hover:bg-green-50 dark:hover:bg-gray-800"
                        size="sm"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notificaciones
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Button
                      onClick={() => window.open(`${APP_URL}/`, '_blank')}
                      className="w-full bg-brand hover:bg-brand-dark text-white"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar a la App
                    </Button>
                  </div>
                )}

                {/* Navigation Links - Solo visible en landing (sin autenticacion) */}
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
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-900 dark:hover:text-white transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}

                    {/* Seccion Programas en movil */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Programas
                      </p>
                      {programsItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-900 dark:hover:text-white transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <div>
                            <span className="font-medium block">{item.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Seccion Socios en movil */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Socios
                      </p>
                      {sociosItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-900 dark:hover:text-white transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <div>
                            <span className="font-medium block">{item.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </nav>
                )}

                {/* Logout Button */}
                {user && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Cerrar Sesion</span>
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
