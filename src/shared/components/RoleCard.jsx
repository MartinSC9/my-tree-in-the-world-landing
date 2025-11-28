import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';
import { Checkbox } from '@shared/components/ui/checkbox';

const RoleCard = ({ role, icon: Icon, title, description, features, color, isSelected, onToggle }) => {
  const colorConfig = {
    green: {
      gradient: 'from-green-500 to-emerald-600',
      border: 'border-green-400',
      hoverBorder: 'hover:border-green-400',
      bg: 'from-white to-green-50/30',
      selectedBg: 'from-green-50 to-green-100',
      checkColor: 'text-green-600',
      iconBg: 'from-green-500 to-emerald-600',
      titleColor: 'text-green-800'
    },
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-400',
      hoverBorder: 'hover:border-blue-400',
      bg: 'from-white to-blue-50/30',
      selectedBg: 'from-blue-50 to-blue-100',
      checkColor: 'text-blue-600',
      iconBg: 'from-blue-500 to-blue-600',
      titleColor: 'text-blue-800'
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      border: 'border-emerald-400',
      hoverBorder: 'hover:border-emerald-400',
      bg: 'from-white to-emerald-50/30',
      selectedBg: 'from-emerald-50 to-emerald-100',
      checkColor: 'text-emerald-600',
      iconBg: 'from-emerald-500 to-emerald-600',
      titleColor: 'text-emerald-800'
    },
    teal: {
      gradient: 'from-teal-500 to-teal-600',
      border: 'border-teal-400',
      hoverBorder: 'hover:border-teal-400',
      bg: 'from-white to-teal-50/30',
      selectedBg: 'from-teal-50 to-teal-100',
      checkColor: 'text-teal-600',
      iconBg: 'from-teal-500 to-teal-600',
      titleColor: 'text-teal-800'
    }
  };

  const config = colorConfig[color] || colorConfig.green;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
        isSelected
          ? `${config.border} shadow-lg bg-gradient-to-br ${config.selectedBg} ring-2 ring-offset-2 ring-${color}-200`
          : `border-gray-200 ${config.hoverBorder} hover:shadow-lg bg-gradient-to-br ${config.bg}`
      }`}
    >
      {/* Checkbox in top right */}
      <div className="absolute top-3 right-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="h-5 w-5"
        />
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 left-3">
          <CheckCircle2 className={`h-5 w-5 ${config.checkColor}`} />
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-3 mt-2">
        <div className={`p-3 rounded-full bg-gradient-to-br ${config.iconBg} shadow-md`}>
          <Icon className="h-8 w-8 text-white" />
        </div>

        <div>
          <h3 className={`text-lg font-bold mb-1 ${config.titleColor}`}>{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>

        <div className="w-full text-left space-y-1.5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className={`h-3.5 w-3.5 ${config.checkColor} mt-0.5 flex-shrink-0`} />
              <span className="text-xs text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;
