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
  Info,
  Heart,
} from 'lucide-react';
import { APP_URL } from '@core/config/app.config';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

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
    { name: 'Sobre Nosotros', path: '/sobre-nosotros', icon: Info, isInternal: true },
    { name: 'Colaborativos', path: '/colaborativos', icon: Heart, isInternal: true },
  ];

  // Programas - Deshabilitado temporalmente
  // const programsItems = [
  //   { name: 'Sorteos', path: '/sorteos', icon: Gift, desc: 'Participa y gana arboles' },
  //   { name: 'Referidos', path: '/referidos', icon: Share2, desc: 'Invita amigos y gana puntos' },
  //   { name: 'QR Empresas', path: '/qr-productos', icon: QrCode, desc: 'Programa para empresas partner' },
  // ];

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
        className="bg-black/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-[1000]"
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
              <TreePine className="h-7 w-7 text-emerald-400" />
              <span className="text-lg font-bold text-white hidden xl:block">
                Mi Árbol en el Mundo
              </span>
              <span className="text-lg font-bold text-white xl:hidden hidden md:block">
                Mi Árbol
              </span>
            </Link>

            {/* Desktop Navigation - Solo visible en landing (sin autenticacion) */}
            {!user && (
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl">
                {navigationItems.map((item) => {
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);
                  const baseClass =
                    'transition-all flex items-center gap-1.5 font-medium px-4 h-16 rounded-none border-b-2';
                  const activeClass = isActive
                    ? 'text-white border-emerald-400 bg-white/[0.05]'
                    : 'text-white/60 border-transparent hover:text-white hover:bg-white/[0.05] hover:border-emerald-400/50';

                  return item.isInternal ? (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={item.path === '/' ? scrollToTop : undefined}
                      className={`${baseClass} ${activeClass}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => (window.location.href = item.path)}
                      className={`${baseClass} ${activeClass}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </button>
                  );
                })}

                {/* Dropdown Programas - Deshabilitado temporalmente */}

                {/* Dropdown Socios */}
                <div className="relative" ref={sociosDropdownRef}>
                  <button
                    onClick={() => setIsSociosDropdownOpen(!isSociosDropdownOpen)}
                    className="text-white/60 hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-1.5 font-medium px-4 h-16 rounded-none border-b-2 border-transparent hover:border-emerald-400/50"
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
                        className="absolute left-0 mt-2 w-64 bg-gray-950 rounded-xl shadow-2xl border border-white/[0.08] py-2 z-50"
                      >
                        {sociosItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsSociosDropdownOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              <p className="text-xs text-white/40">{item.desc}</p>
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
              {user ? (
                <>
                  {/* Boton de notificaciones */}
                  <button
                    onClick={() => navigate(`/usuario/${user.id}/notificaciones`)}
                    className="relative p-2 hover:bg-white/[0.05] rounded-lg transition-colors group"
                    aria-label="Notificaciones"
                  >
                    <Bell className="h-5 w-5 text-white/60 group-hover:text-white" />
                  </button>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-white/[0.05] rounded-lg transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm group-hover:bg-emerald-500 transition-colors">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-white max-w-[120px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-950 rounded-lg shadow-2xl border border-white/[0.08] py-2 z-50"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-white/[0.06]">
                            <p className="text-sm font-medium text-white">{user.username}</p>
                            <p className="text-xs text-white/40 mt-1 truncate">{user.email}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate(getDashboardPath());
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              {user.role === 'user' ? 'Ver mi perfil' : 'Ver panel'}
                            </button>
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
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
                <button
                  onClick={() => window.open(`${APP_URL}/plantar`, '_blank')}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <TreePine className="h-4 w-4" />
                  Plantar
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors flex-shrink-0"
                aria-label="Abrir menu de navegacion"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-white/70" />
                ) : (
                  <Menu className="h-6 w-6 text-white/70" />
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
              className="fixed top-0 right-0 bottom-0 w-80 bg-gray-950 border-l border-white/[0.06] shadow-2xl z-[1000] lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-2">
                    <TreePine className="h-6 w-6 text-emerald-400" />
                    <span className="text-lg font-bold text-white">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/[0.05]"
                    aria-label="Cerrar menu"
                  >
                    <X className="h-5 w-5 text-white/60" />
                  </button>
                </div>

                {/* User Profile Section */}
                {user ? (
                  <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.username}</p>
                        <p className="text-xs text-white/40 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleNavigation(getDashboardPath())}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-lg transition-all"
                      >
                        <User className="h-4 w-4" />
                        {user.role === 'user' ? 'Perfil' : 'Panel'}
                      </button>
                      <button
                        onClick={() => handleNavigation(`/usuario/${user.id}/notificaciones`)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 border border-white/[0.1] text-white/70 hover:bg-white/[0.05] text-sm rounded-lg transition-all"
                      >
                        <Bell className="h-4 w-4" />
                        Alertas
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <button
                      onClick={() => (window.location.href = APP_URL)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full transition-all"
                    >
                      <LogIn className="h-4 w-4" />
                      Ir a la App
                    </button>
                  </div>
                )}

                {/* Navigation Links - Solo visible en landing (sin autenticacion) */}
                {!user && (
                  <nav className="space-y-1">
                    {navigationItems.map((item) => {
                      const isActive =
                        item.path === '/'
                          ? location.pathname === '/'
                          : location.pathname.startsWith(item.path);
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (item.isInternal) {
                              handleNavigation(item.path);
                            } else {
                              window.location.href = item.path;
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            isActive
                              ? 'bg-white/[0.08] text-white font-semibold'
                              : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      );
                    })}

                    {/* Seccion Programas en movil - Deshabilitado temporalmente */}

                    {/* Seccion Socios en movil */}
                    <div className="pt-4 mt-4 border-t border-white/[0.06]">
                      <p className="px-4 py-2 text-xs font-semibold text-white/30 uppercase tracking-wider">
                        Socios
                      </p>
                      {sociosItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <div>
                            <span className="font-medium block">{item.name}</span>
                            <span className="text-xs text-white/30">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </nav>
                )}

                {/* Logout Button */}
                {user && (
                  <div className="mt-6 pt-6 border-t border-white/[0.06]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors"
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
