// Configuración editable de la calculadora de carbono
let carbonConfig = {
  emissionFactors: {
    electricity: 0.5, // kg CO2 por kWh
    gas: 2.0, // kg CO2 por m3
    vehicle: 0.2, // kg CO2 por km
    flight: 0.25, // kg CO2 por km
    waste: 0.5, // kg CO2 por kg
    paper: 3.3, // kg CO2 por kg
    employee: 2000, // kg CO2 por empleado por año
  },
  treeAbsorption: 22, // kg CO2 por árbol por año
};

export const getCarbonConfig = () => {
  // Intentar cargar desde localStorage
  const stored = localStorage.getItem('carbonConfig');
  if (stored) {
    try {
      carbonConfig = JSON.parse(stored);
    } catch (error) {
      console.error('Error loading carbon config:', error);
    }
  }
  return carbonConfig;
};

export const updateCarbonConfig = (newConfig) => {
  carbonConfig = { ...carbonConfig, ...newConfig };
  localStorage.setItem('carbonConfig', JSON.stringify(carbonConfig));
  return carbonConfig;
};

export const resetCarbonConfig = () => {
  const defaultConfig = {
    emissionFactors: {
      electricity: 0.5,
      gas: 2.0,
      vehicle: 0.2,
      flight: 0.25,
      waste: 0.5,
      paper: 3.3,
      employee: 2000,
    },
    treeAbsorption: 22,
  };
  carbonConfig = defaultConfig;
  localStorage.setItem('carbonConfig', JSON.stringify(carbonConfig));
  return carbonConfig;
};
