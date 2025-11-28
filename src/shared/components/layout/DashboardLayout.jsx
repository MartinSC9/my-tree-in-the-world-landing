import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@core/contexts/AuthContext';
import { getNavigationForRole, getFullPath } from '@/config/dashboardNavigation';
import { Menu, X, ChevronLeft, LogOut } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const navigation = getNavigationForRole(user.role);
  const userId = user.id;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActivePath = (itemPath) => {
    const fullPath = getFullPath(user.role, userId, itemPath);
    return location.pathname === fullPath || location.pathname.startsWith(fullPath);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 hidden lg:block ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                  {user.username}
                </span>
                <span className="text-xs text-gray-500">{navigation.label}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navigation.items.map((item) => {
              const Icon = item.icon;
              const fullPath = getFullPath(user.role, userId, item.path);
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={fullPath}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  {isSidebarOpen && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-green-600 rounded-r"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-2">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className={`w-full justify-start text-gray-700 hover:bg-gray-50 ${
              !isSidebarOpen && 'justify-center'
            }`}
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Cerrar sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">{user.username}</span>
              <span className="text-xs text-gray-500 block">{navigation.label}</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white z-50 overflow-y-auto"
            >
              <nav className="py-4 px-2">
                <div className="space-y-1">
                  {navigation.items.map((item) => {
                    const Icon = item.icon;
                    const fullPath = getFullPath(user.role, userId, item.path);
                    const isActive = isActivePath(item.path);

                    return (
                      <Link
                        key={item.id}
                        to={fullPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="border-t border-gray-200 p-2 mt-4">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Cerrar sesión
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`lg:transition-all lg:duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        } pt-16 lg:pt-0`}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
