import React, { useState, useEffect } from 'react';
import { useAuth } from '@core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { useToast } from '@shared/components/ui/use-toast';
import { User, Building2, Shield, Sprout, TreePine, Plus, Trash2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@shared/components/layout/Navbar';

const roleConfig = {
  user: {
    label: 'Usuario',
    icon: User,
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  company: {
    label: 'Empresa',
    icon: Building2,
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  admin: {
    label: 'Administrador',
    icon: Shield,
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  plantador: {
    label: 'Plantador',
    icon: Sprout,
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  vivero: {
    label: 'Vivero',
    icon: TreePine,
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200'
  }
};

const availableRolesToAdd = ['user', 'company', 'vivero', 'plantador'];

const ProfileSettingsPage = () => {
  const { user, addRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState('');

  if (!user) {
    return null;
  }

  const currentRoles = user.roles || [];
  const userRoleNames = currentRoles.map(r => r.role);
  const availableToAdd = availableRolesToAdd.filter(role => !userRoleNames.includes(role));

  const handleAddRole = async () => {
    if (!selectedNewRole) {
      toast({
        title: "Selecciona un rol",
        description: "Debes seleccionar un rol para agregar",
        variant: "destructive"
      });
      return;
    }

    try {
      await addRole(selectedNewRole);
      setSelectedNewRole('');
      setIsAddingRole(false);
    } catch (error) {
      // Error handling is done in AuthContext
      console.error('Error adding role:', error);
    }
  };

  const handleSwitchRole = async (newRole) => {
    if (newRole === user.role) return;

    try {
      const { redirectTo } = await switchRole(newRole);
      navigate(redirectTo);
    } catch (error) {
      // Error handling is done in AuthContext
      console.error('Error switching role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración de Perfil</h1>
              <p className="text-gray-600">Gestiona tus roles y preferencias</p>
            </div>
          </div>

          {/* User Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información de Usuario</CardTitle>
              <CardDescription>Detalles de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Nombre de usuario:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Rol activo:</span>
                <span className={`font-semibold ${roleConfig[user.role]?.textColor}`}>
                  {roleConfig[user.role]?.label}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Roles Management Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mis Roles</CardTitle>
                  <CardDescription>
                    Gestiona los roles asociados a tu cuenta
                  </CardDescription>
                </div>
                {availableToAdd.length > 0 && (
                  <Button
                    onClick={() => setIsAddingRole(!isAddingRole)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Rol
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Role Section */}
              <AnimatePresence>
                {isAddingRole && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    <h4 className="font-semibold text-sm text-gray-700">Selecciona un rol para agregar:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableToAdd.map(role => {
                        const config = roleConfig[role];
                        const Icon = config.icon;
                        return (
                          <button
                            key={role}
                            onClick={() => setSelectedNewRole(role)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              selectedNewRole === role
                                ? `${config.borderColor} ${config.bgColor} shadow-md`
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`h-5 w-5 ${config.textColor}`} />
                              <span className="font-medium text-sm">{config.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddRole}
                        disabled={!selectedNewRole}
                        className="flex-1"
                        size="sm"
                      >
                        Agregar Rol
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAddingRole(false);
                          setSelectedNewRole('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current Roles List */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Roles actuales:</h4>
                {currentRoles.map((roleObj) => {
                  const config = roleConfig[roleObj.role] || roleConfig.user;
                  const Icon = config.icon;
                  const isActive = roleObj.role === user.role;

                  return (
                    <motion.div
                      key={roleObj.role}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        isActive
                          ? `${config.borderColor} ${config.bgColor} shadow-sm`
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.textColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{config.label}</p>
                          {isActive && (
                            <p className="text-xs text-green-600 font-medium">Rol activo</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <Button
                            onClick={() => handleSwitchRole(roleObj.role)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Activar
                          </Button>
                        )}
                        {isActive && (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            Activo
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {currentRoles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No tienes roles asignados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
