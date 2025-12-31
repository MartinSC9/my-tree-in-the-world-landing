/**
 * Utilidades de clases Tailwind reutilizables
 * Centraliza patrones de estilos duplicados en el proyecto
 */

// Gradientes de fondo para páginas
export const pageGradients = {
  green: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
  purple: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50',
  blue: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
  amber: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
};

// Gradientes para botones
export const buttonGradients = {
  green: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
  purple:
    'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
  blue: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
  amber: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
  red: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
};

// Gradientes para cards de estadísticas
export const cardGradients = {
  green: 'bg-gradient-to-br from-green-500 to-green-600',
  emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  teal: 'bg-gradient-to-br from-teal-500 to-teal-600',
  blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
  purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  amber: 'bg-gradient-to-br from-amber-500 to-amber-600',
  orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
  red: 'bg-gradient-to-br from-red-500 to-red-600',
  indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  cyan: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
};

// Estilos de sombras para cards
export const cardShadows = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md hover:shadow-lg transition-shadow',
  lg: 'shadow-lg hover:shadow-xl transition-shadow',
  xl: 'shadow-xl hover:shadow-2xl transition-shadow',
  '2xl': 'shadow-2xl',
};

// Estilos de inputs
export const inputStyles = {
  base: 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
  green: 'border-green-300 focus:border-green-500 focus:ring-green-200',
  purple: 'border-purple-300 focus:border-purple-500 focus:ring-purple-200',
  blue: 'border-blue-300 focus:border-blue-500 focus:ring-blue-200',
  gray: 'border-gray-300 focus:border-gray-500 focus:ring-gray-200',
};

// Combinar estilos de input
export const getInputClass = (color = 'green') => {
  return `${inputStyles.base} ${inputStyles[color] || inputStyles.green}`;
};

// Estilos de botones base
export const buttonBase = {
  primary:
    'w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'w-full h-12 border-2 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50',
  ghost:
    'px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors',
};

// Combinar estilos de botón
export const getButtonClass = (variant = 'primary', color = 'green') => {
  if (variant === 'primary') {
    return `${buttonBase.primary} ${buttonGradients[color] || buttonGradients.green}`;
  }
  return buttonBase[variant] || buttonBase.primary;
};

// Estilos de texto para estadísticas en cards
export const statTextColors = {
  green: { label: 'text-green-100', value: 'text-white', icon: 'text-green-200 opacity-80' },
  emerald: { label: 'text-emerald-100', value: 'text-white', icon: 'text-emerald-200 opacity-80' },
  teal: { label: 'text-teal-100', value: 'text-white', icon: 'text-teal-200 opacity-80' },
  blue: { label: 'text-blue-100', value: 'text-white', icon: 'text-blue-200 opacity-80' },
  purple: { label: 'text-purple-100', value: 'text-white', icon: 'text-purple-200 opacity-80' },
  amber: { label: 'text-amber-100', value: 'text-white', icon: 'text-amber-200 opacity-80' },
  orange: { label: 'text-orange-100', value: 'text-white', icon: 'text-orange-200 opacity-80' },
  red: { label: 'text-red-100', value: 'text-white', icon: 'text-red-200 opacity-80' },
  indigo: { label: 'text-indigo-100', value: 'text-white', icon: 'text-indigo-200 opacity-80' },
  cyan: { label: 'text-cyan-100', value: 'text-white', icon: 'text-cyan-200 opacity-80' },
};

// Layout de grid para dashboards
export const dashboardGrids = {
  stats2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  stats3: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  stats4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  stats6: 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6',
};

// Animaciones comunes
export const animations = {
  fadeIn: 'animate-in fade-in duration-300',
  slideUp: 'animate-in slide-in-from-bottom duration-300',
  scaleIn: 'animate-in zoom-in duration-200',
};
