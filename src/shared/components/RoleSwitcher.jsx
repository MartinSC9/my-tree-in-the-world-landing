import React, { useState } from 'react';
import { useAuth } from '@core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Building2, Shield, Sprout, TreePine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roleConfig = {
  user: {
    label: 'Usuario',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  company: {
    label: 'Empresa',
    icon: Building2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  },
  admin: {
    label: 'Administrador',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100'
  },
  plantador: {
    label: 'Plantador',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100'
  },
  vivero: {
    label: 'Vivero',
    icon: TreePine,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100'
  }
};

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // If user doesn't have roles array or only has one role, don't show the switcher
  if (!user?.roles || user.roles.length <= 1) {
    return null;
  }

  const activeRole = user.role;
  const ActiveIcon = roleConfig[activeRole]?.icon || User;
  const activeConfig = roleConfig[activeRole] || roleConfig.user;

  const handleRoleSwitch = async (newRole) => {
    if (newRole === activeRole || isSwitching) return;

    setIsSwitching(true);
    setIsOpen(false);

    try {
      const { redirectTo } = await switchRole(newRole);
      navigate(redirectTo);
    } catch (error) {
      console.error('Error switching role:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeConfig.bgColor} ${activeConfig.hoverColor} ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSwitching}
      >
        <ActiveIcon className={`h-4 w-4 ${activeConfig.color}`} />
        <span className={`text-sm font-medium ${activeConfig.color}`}>
          {isSwitching ? 'Cambiando...' : activeConfig.label}
        </span>
        <ChevronDown className={`h-4 w-4 ${activeConfig.color} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase">Cambiar Rol</p>
              </div>

              {user.roles.map((roleObj) => {
                const role = roleObj.role;
                const config = roleConfig[role] || roleConfig.user;
                const Icon = config.icon;
                const isActive = role === activeRole;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    disabled={isActive || isSwitching}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      isActive
                        ? `${config.bgColor} ${config.color} cursor-default`
                        : `hover:bg-gray-50 text-gray-700 ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? config.color : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{config.label}</span>
                    {isActive && (
                      <span className="ml-auto text-xs font-semibold text-green-600">✓</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
