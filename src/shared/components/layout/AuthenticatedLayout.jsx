import React from 'react';
import { useAuth } from '@core/contexts/AuthContext';
import Navbar from '@shared/components/layout/Navbar';
import UserSidebar from '@modules/user/components/UserSidebar';
import UserBottomNav from '@modules/user/components/UserBottomNav';

const AuthenticatedLayout = ({ children, showSidebar = true }) => {
  const { user } = useAuth();

  // Solo mostrar el sidebar si el usuario tiene rol 'user' y showSidebar es true
  const shouldShowSidebar = showSidebar && user?.role === 'user';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className={`flex max-w-full ${shouldShowSidebar ? 'pb-20 lg:pb-0' : ''}`}>
        {/* Sidebar - Solo visible para usuarios regulares, oculto en móvil */}
        {shouldShowSidebar && (
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0 bg-white shadow-lg min-h-screen">
            <UserSidebar />
          </div>
        )}

        {/* Contenido principal */}
        <div className={`flex-1 ${shouldShowSidebar ? 'p-4 lg:p-8' : ''} max-w-full overflow-x-hidden`}>
          {children}
        </div>
      </div>

      {/* Bottom Navigation - Solo visible para usuarios regulares en móvil */}
      {shouldShowSidebar && <UserBottomNav />}
    </div>
  );
};

export default AuthenticatedLayout;
