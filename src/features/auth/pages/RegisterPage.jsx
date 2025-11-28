import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, TreePine, Eye, EyeOff, Building2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { FaSeedling, FaLeaf } from 'react-icons/fa';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useToast } from '@shared/components/ui/use-toast';
import { authService } from '@features/auth/services';
import RoleCard from '@shared/components/RoleCard';
import { useAuth } from '@core/contexts/AuthContext';

const RegisterPage = () => {
  const [step, setStep] = useState(1); // Paso del onboarding
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    selectedRole: '', // Solo un rol a la vez
    company_name: '' // Para empresas
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuthUser } = useAuth();

  const getAccountTypeLabel = (type) => {
    const labels = {
      'user': 'Usuario Individual',
      'company': 'Empresa',
      'plantador': 'Plantador',
      'vivero': 'Vivero'
    };
    return labels[type] || type;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    // Validar que si es empresa, tenga nombre
    if (formData.selectedRole === 'company' && !formData.company_name.trim()) {
      toast({
        title: "Error",
        description: "Las empresas deben proporcionar un nombre de empresa",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Generar username del email
      const username = formData.email.split('@')[0];

      // Preparar datos de registro
      const registerData = {
        email: formData.email,
        password: formData.password,
        username: username,
        role: formData.selectedRole // Un solo rol
      };

      // Si es empresa, agregar nombre de empresa
      if (formData.selectedRole === 'company') {
        registerData.company_name = formData.company_name;
      }

      // Registrar el usuario con el backend
      const { user } = await authService.register(registerData);

      // Actualizar el contexto de autenticación
      setAuthUser(user);

      toast({
        title: "¡Bienvenido!",
        description: "Tu cuenta ha sido creada exitosamente.",
        variant: "default"
      });

      // Redirigir al dashboard del rol seleccionado
      const dashboardRoutes = {
        user: '/usuario/dashboard',
        company: '/empresa/dashboard',
        vivero: '/vivero/dashboard',
        plantador: '/plantador/dashboard'
      };

      navigate(dashboardRoutes[formData.selectedRole] || '/');
    } catch (error) {
      console.error('Error de registro:', error);
      toast({
        title: "Error al crear cuenta",
        description: error.response?.data?.error || error.message || "No se pudo crear la cuenta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setFormData(prev => ({
      ...prev,
      selectedRole: role,
      company_name: role === 'company' ? prev.company_name : '' // Limpiar si cambia de rol
    }));
  };

  const canProceedToStep2 = formData.selectedRole !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="flex items-center justify-center p-4 overflow-hidden relative py-8 min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-green-200 opacity-20">
          <TreePine size={120} />
        </div>
        <div className="absolute bottom-20 right-10 text-emerald-200 opacity-20">
          <FaLeaf size={100} />
        </div>
      </div>

      <Card className="w-full max-w-6xl shadow-2xl border-0 relative z-10">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TreePine className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center mb-1">
            {step === 1 ? '¿Qué tipo de cuenta necesitas?' : 'Completa tu registro'}
          </CardTitle>
          <CardDescription className="text-center text-green-50 text-sm">
            {step === 1
              ? 'Selecciona el tipo de cuenta que necesitas'
              : `Registrándote como: ${getAccountTypeLabel(formData.selectedRole)}`
            }
          </CardDescription>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full transition-all ${step >= 1 ? 'bg-white scale-110' : 'bg-white/30'}`} />
              <span className="text-xs text-green-50">Tipo de cuenta</span>
            </div>
            <div className={`h-0.5 w-12 transition-colors ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full transition-all ${step >= 2 ? 'bg-white scale-110' : 'bg-white/30'}`} />
              <span className="text-xs text-green-50">Datos personales</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Selecciona el rol que mejor describa tu participación en la plataforma
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <RoleCard
                    role="user"
                    icon={User}
                    title="Usuario Individual"
                    description="Planta árboles, rastrea tu impacto y contribuye a un mundo más verde"
                    features={[
                      'Árboles virtuales y físicos',
                      'Certificados digitales',
                      'Puntos ecológicos'
                    ]}
                    color="green"
                    isSelected={formData.selectedRole === 'user'}
                    onToggle={() => selectRole('user')}
                  />

                  <RoleCard
                    role="company"
                    icon={Building2}
                    title="Empresa"
                    description="Compensa tu huella de carbono y demuestra responsabilidad social"
                    features={[
                      'Calculadora de carbono',
                      'Plantación corporativa',
                      'Reportes de impacto'
                    ]}
                    color="blue"
                    isSelected={formData.selectedRole === 'company'}
                    onToggle={() => selectRole('company')}
                  />

                  <RoleCard
                    role="plantador"
                    icon={FaSeedling}
                    title="Plantador"
                    description="Encargado de plantar árboles físicos en el terreno"
                    features={[
                      'Gestión de órdenes de trabajo',
                      'Registro de plantaciones',
                      'Actualización de estados'
                    ]}
                    color="green"
                    isSelected={formData.selectedRole === 'plantador'}
                    onToggle={() => selectRole('plantador')}
                  />

                  <RoleCard
                    role="vivero"
                    icon={FaLeaf}
                    title="Vivero"
                    description="Prepara y cuida los árboles antes de la plantación"
                    features={[
                      'Preparación de árboles',
                      'Control de inventario',
                      'Gestión de órdenes'
                    ]}
                    color="emerald"
                    isSelected={formData.selectedRole === 'vivero'}
                    onToggle={() => selectRole('vivero')}
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="text-center text-xs text-gray-500 mt-4">
                  {formData.selectedRole
                    ? `Has seleccionado: ${getAccountTypeLabel(formData.selectedRole)}`
                    : 'Selecciona un rol para continuar'}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-12 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recibirás confirmaciones y notificaciones en este email</p>
                  </div>

                  {/* Campo adicional para empresas */}
                  {formData.selectedRole === 'company' && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Nombre de la Empresa *</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Nombre de tu empresa"
                          className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          value={formData.company_name}
                          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">El nombre oficial de tu empresa</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-12 pr-12 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Debe tener al menos 6 caracteres</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        className="pl-12 pr-12 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base border-gray-300 hover:bg-gray-50"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Creando cuenta...</span>
                        </div>
                      ) : (
                        <>
                          Crear Cuenta
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-4 text-center text-sm">
                  <span className="text-gray-600">¿Ya tienes cuenta? </span>
                  <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors">
                    Inicia sesión aquí
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default RegisterPage;