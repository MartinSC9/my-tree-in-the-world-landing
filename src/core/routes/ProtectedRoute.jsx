import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@core/contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Manejar múltiples roles permitidos
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // Check if user's active role matches
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // Check if user has any of the required roles in their multi-role list
  if (user.roles && user.roles.length > 0) {
    const userRolesList = user.roles.map(r => r.role);
    const hasRequiredRole = allowedRoles.some(role => userRolesList.includes(role));
    
    if (hasRequiredRole) {
      // User has the required role but it's not active
      // Show a message or redirect to a page where they can switch roles
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cambio de Rol Requerido</h2>
            <p className="text-gray-600 mb-6">
              Tienes acceso a esta página, pero necesitas cambiar tu rol activo.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Rol requerido: <span className="font-semibold">{allowedRoles.join(', ')}</span>
            </p>
            <p className="text-sm text-gray-500">
              Tu rol actual: <span className="font-semibold">{user.role}</span>
            </p>
            <p className="text-xs text-gray-400 mt-6">
              Por favor, usa el selector de roles en la barra de navegación para cambiar tu rol activo.
            </p>
          </div>
        </div>
      );
    }
  }

  // User doesn't have any of the required roles
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
