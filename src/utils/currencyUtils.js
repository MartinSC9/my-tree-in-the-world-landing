/**
 * Utilidades para formateo de moneda y cálculos financieros
 * Centraliza funciones duplicadas en el proyecto
 */

/**
 * Formatea un valor numérico como moneda argentina (ARS)
 * @param {number|string} amount - Monto a formatear
 * @returns {string} Monto formateado como moneda
 */
export const formatCurrency = (amount) => {
  const value = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Calcula el porcentaje de financiamiento alcanzado
 * @param {number|string} currentAmount - Monto actual recaudado
 * @param {number|string} targetAmount - Monto objetivo
 * @returns {number} Porcentaje de financiamiento (0-100)
 */
export const calculateFundingPercentage = (currentAmount, targetAmount) => {
  const current = parseFloat(currentAmount) || 0;
  const target = parseFloat(targetAmount) || 0;
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

/**
 * Calcula el monto restante para alcanzar el objetivo
 * @param {number|string} currentAmount - Monto actual recaudado
 * @param {number|string} targetAmount - Monto objetivo
 * @returns {number} Monto restante (mínimo 0)
 */
export const calculateRemainingAmount = (currentAmount, targetAmount) => {
  const current = parseFloat(currentAmount) || 0;
  const target = parseFloat(targetAmount) || 0;
  return Math.max(target - current, 0);
};

/**
 * Formatea un número con separadores de miles
 * @param {number|string} value - Valor a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat('es-AR').format(num);
};

/**
 * Parsea un string de moneda a número
 * @param {string} currencyString - String de moneda (ej: "$1.500")
 * @returns {number} Valor numérico
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  if (!currencyString) return 0;
  return parseFloat(currencyString.replace(/[^0-9,-]+/g, '').replace(',', '.')) || 0;
};
