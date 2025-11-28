/**
 * Componente de tarjeta de estadísticas reutilizable
 * Centraliza el patrón de cards duplicado en los dashboards
 */
import React from 'react';
import { Card, CardContent } from '@shared/components/ui/card';
import { cardGradients, statTextColors } from '@/styles/tailwindUtils';

/**
 * Componente StatCard
 * @param {Object} props
 * @param {string} props.label - Etiqueta de la estadística
 * @param {string|number} props.value - Valor de la estadística
 * @param {React.ComponentType} props.icon - Componente de icono (de lucide-react o react-icons)
 * @param {string} props.color - Color del tema ('green', 'emerald', 'teal', 'blue', 'purple', 'amber', 'orange', 'red', 'indigo', 'cyan')
 * @param {string} props.className - Clases adicionales para el Card
 * @param {Function} props.onClick - Handler para click (opcional)
 * @param {string} props.trend - Indicador de tendencia ('+12%', '-5%', etc.) (opcional)
 * @param {string} props.trendType - Tipo de tendencia ('up', 'down', 'neutral') (opcional)
 * @param {string} props.subtitle - Subtítulo adicional (opcional)
 */
const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'green',
  className = '',
  onClick = null,
  trend = null,
  trendType = 'neutral',
  subtitle = null,
}) => {
  const gradient = cardGradients[color] || cardGradients.green;
  const textColors = statTextColors[color] || statTextColors.green;

  const trendColors = {
    up: 'text-green-200',
    down: 'text-red-200',
    neutral: 'text-white/60',
  };

  return (
    <Card
      className={`${gradient} text-white ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`${textColors.label} text-sm font-medium`}>{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className={`${textColors.label} text-xs mt-1`}>{subtitle}</p>}
            {trend && (
              <p className={`text-sm mt-1 ${trendColors[trendType]}`}>
                {trend}
              </p>
            )}
          </div>
          {Icon && <Icon className={`h-12 w-12 ${textColors.icon}`} />}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Componente DashboardStatsGrid
 * Grid de estadísticas para dashboards
 * @param {Object} props
 * @param {Array} props.stats - Array de objetos de estadísticas
 * @param {number} props.columns - Número de columnas (2, 3, 4, 6)
 * @param {string} props.className - Clases adicionales
 */
export const DashboardStatsGrid = ({ stats, columns = 3, className = '' }) => {
  const gridClasses = {
    2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 md:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    6: 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6',
  };

  return (
    <div className={`${gridClasses[columns] || gridClasses[3]} ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id || index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          onClick={stat.onClick}
          trend={stat.trend}
          trendType={stat.trendType}
          subtitle={stat.subtitle}
          className={stat.className}
        />
      ))}
    </div>
  );
};

/**
 * Componente SimpleStatCard
 * Versión simplificada con fondo blanco
 * @param {Object} props
 * @param {string} props.label - Etiqueta
 * @param {string|number} props.value - Valor
 * @param {React.ComponentType} props.icon - Icono
 * @param {string} props.iconColor - Color del icono (clase de Tailwind)
 * @param {string} props.iconBg - Color de fondo del icono (clase de Tailwind)
 */
export const SimpleStatCard = ({
  label,
  value,
  icon: Icon,
  iconColor = 'text-green-600',
  iconBg = 'bg-green-100',
  className = '',
}) => {
  return (
    <Card className={`bg-white shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`${iconBg} p-3 rounded-lg`}>
            {Icon && <Icon className={`h-6 w-6 ${iconColor}`} />}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
