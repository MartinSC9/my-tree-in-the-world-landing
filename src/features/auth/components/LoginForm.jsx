/**
 * Componente de formulario de login reutilizable
 * Centraliza la lógica duplicada de las páginas de login
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Lock, Mail as EmailIcon } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useAuth } from '@core/contexts/AuthContext';
import { useNotification, getErrorMessage } from '@/hooks/useNotification';

/**
 * Configuración de temas de color para el formulario
 */
const colorThemes = {
  green: {
    gradient: 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600',
    buttonGradient: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
    inputBorder: 'border-gray-300 focus:border-green-500 focus:ring-green-500',
    iconColor: 'text-green-500',
    linkColor: 'text-green-600 hover:text-green-700',
    cardBorder: 'border-0',
  },
  blue: {
    gradient: 'admin-gradient',
    buttonGradient: 'admin-gradient',
    inputBorder: 'border-blue-300 focus:border-blue-500',
    iconColor: 'text-blue-500',
    linkColor: 'text-blue-600 hover:text-blue-700',
    cardBorder: 'border-blue-200',
    labelColor: 'text-blue-800',
  },
  purple: {
    gradient: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    buttonGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    inputBorder: 'border-purple-300 focus:border-purple-500',
    iconColor: 'text-purple-500',
    linkColor: 'text-purple-600 hover:text-purple-700',
    cardBorder: 'border-purple-200',
    labelColor: 'text-purple-800',
  },
};

/**
 * Componente LoginForm
 * @param {Object} props
 * @param {string} props.title - Título del formulario
 * @param {string} props.subtitle - Subtítulo del formulario
 * @param {string} props.colorTheme - Tema de color ('green', 'blue', 'purple')
 * @param {string} props.requiredRole - Rol requerido para el login (opcional)
 * @param {React.ReactNode} props.headerIcon - Icono para el header (opcional)
 * @param {Object} props.demoCredentials - Credenciales de demo { email, password } (opcional)
 * @param {boolean} props.showRegisterLink - Mostrar link de registro (default: false)
 * @param {string} props.registerPath - Path para el registro (default: '/registro')
 * @param {boolean} props.showBackButton - Mostrar botón de volver (default: false)
 * @param {string} props.backPath - Path para volver (default: '/')
 * @param {string} props.successMessage - Mensaje de éxito personalizado
 * @param {string} props.loadingText - Texto mientras carga (default: 'Iniciando sesión...')
 * @param {string} props.submitText - Texto del botón de submit (default: 'Iniciar Sesión')
 * @param {boolean} props.showInputIcons - Mostrar iconos en los inputs (default: false)
 * @param {Function} props.onLoginSuccess - Callback adicional al loguearse exitosamente
 */
const LoginForm = ({
  title = 'Iniciar Sesión',
  subtitle = 'Accede a tu cuenta para continuar',
  colorTheme = 'green',
  requiredRole = null,
  headerIcon: HeaderIcon = null,
  demoCredentials = null,
  showRegisterLink = false,
  registerPath = '/registro',
  showBackButton = false,
  backPath = '/',
  successMessage = 'Has iniciado sesión correctamente',
  loadingText = 'Iniciando sesión...',
  submitText = 'Iniciar Sesión',
  showInputIcons = false,
  onLoginSuccess = null,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const theme = colorThemes[colorTheme] || colorThemes.green;

  // Redirección automática si el usuario ya está logueado
  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role, user.id);
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, getRedirectPath, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password, requiredRole);

      if (result) {
        success('¡Bienvenido!', successMessage);

        if (onLoginSuccess) {
          onLoginSuccess(result);
        }

        navigate(result.redirectTo);
      }
    } catch (err) {
      error('Error de autenticación', getErrorMessage(err, 'Credenciales inválidas'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`shadow-2xl ${theme.cardBorder} overflow-hidden`}>
      {/* Header con gradiente */}
      <CardHeader className={`${theme.gradient} text-white text-center p-8`}>
        {HeaderIcon && (
          <div className="flex justify-center mb-4">
            <HeaderIcon className="h-16 w-16" />
          </div>
        )}
        <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{title}</CardTitle>
        <p className="text-white/80">{subtitle}</p>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={`text-sm font-semibold ${theme.labelColor || 'text-gray-700'}`}
            >
              Correo Electrónico
            </Label>
            <div className="relative">
              {showInputIcons && (
                <EmailIcon className={`absolute left-3 top-3 h-5 w-5 ${theme.iconColor}`} />
              )}
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-12 text-base ${theme.inputBorder} ${showInputIcons ? 'pl-10' : ''}`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className={`text-sm font-semibold ${theme.labelColor || 'text-gray-700'}`}
            >
              Contraseña
            </Label>
            <div className="relative">
              {showInputIcons && (
                <Lock className={`absolute left-3 top-3 h-5 w-5 ${theme.iconColor}`} />
              )}
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`h-12 text-base pr-12 ${theme.inputBorder} ${showInputIcons ? 'pl-10' : ''}`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full h-12 ${theme.buttonGradient} text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{loadingText}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>{submitText}</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        {demoCredentials && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Cuenta Demo:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Email: <code className="bg-gray-100 px-1 rounded">{demoCredentials.email}</code>
              </p>
              <p>
                Contraseña:{' '}
                <code className="bg-gray-100 px-1 rounded">{demoCredentials.password}</code>
              </p>
            </div>
          </div>
        )}

        {/* Register Link */}
        {showRegisterLink && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={() => navigate(registerPath)}
                className={`font-semibold hover:underline transition-colors ${theme.linkColor}`}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
