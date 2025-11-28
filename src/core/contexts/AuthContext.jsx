import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@features/auth/services';
import { toast } from '@shared/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const storedUser = authService.getUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType = null) => {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos.');
    }

    try {
      const { user: authUser } = await authService.login(email, password);
      // Si se especifica un userType, verificar que coincida
      if (userType && authUser.role !== userType) {
        await authService.logout();
        throw new Error(`Rol incorrecto. Estás intentando acceder como ${userType} pero tu cuenta es de tipo ${authUser.role}.`);
      }

      setUser(authUser);

      const redirectPath = getRedirectPath(authUser.role, authUser.id);
      // Redirección automática basada en el rol del usuario
      return {
        user: authUser,
        redirectTo: redirectPath
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Error al iniciar sesión.');
    }
  };

  const getRedirectPath = (role, userId) => {
    switch (role) {
      case 'admin':
        return `/admin/${userId}/dashboard`;
      case 'company':
      case 'empresa':
        return `/empresa/${userId}/dashboard`;
      case 'plantador':
        return `/plantador/${userId}/dashboard`;
      case 'vivero':
        return `/vivero/${userId}/dashboard`;
      case 'user':
        return `/usuario/${userId}/feed`;
      default:
        return '/';
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: "Error al cerrar sesión", description: error.message, variant: "destructive" });
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const updatedUser = {
        ...prev,
        ...updatedData
      };
      // Actualizar también en localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const setAuthUser = (userData) => {
    setUser(userData);
  };


  const switchRole = async (newRole) => {
    try {
      const updatedUser = await authService.switchRole(newRole);
      setUser(updatedUser);
      
      toast({
        title: "Rol cambiado",
        description: `Ahora estás usando el rol: ${newRole}`,
      });

      return {
        user: updatedUser,
        redirectTo: getRedirectPath(newRole, updatedUser.id)
      };
    } catch (error) {
      console.error('Switch role error:', error);
      toast({
        title: "Error al cambiar de rol",
        description: error.response?.data?.error || error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const addRole = async (role) => {
    try {
      await authService.addRole(role);
      // Refresh user data to get updated roles
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Rol agregado",
        description: `El rol ${role} ha sido agregado a tu cuenta.`,
      });
      
      return updatedUser;
    } catch (error) {
      console.error('Add role error:', error);
      toast({
        title: "Error al agregar rol",
        description: error.response?.data?.error || error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  const value = {
    user,
    login,
    logout,
    loading,
    getRedirectPath,
    updateUser,
    setAuthUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
