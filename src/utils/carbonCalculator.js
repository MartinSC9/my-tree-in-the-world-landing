
import { getCarbonConfig } from '../lib/carbonConfig';

export const calculateCarbonFootprint = (data) => {
  const {
    employees = 0,
    electricityKwh = 0,
    gasM3 = 0,
    vehicleKm = 0,
    flightsKm = 0,
    wasteKg = 0,
    paperKg = 0
  } = data;

  // Obtener factores de emisión desde la configuración
  const config = getCarbonConfig();
  const emissionFactors = config.emissionFactors;

  const emissions = {
    employees: employees * emissionFactors.employee,
    electricity: electricityKwh * emissionFactors.electricity,
    gas: gasM3 * emissionFactors.gas,
    transport: vehicleKm * emissionFactors.vehicle,
    flights: flightsKm * emissionFactors.flight,
    waste: wasteKg * emissionFactors.waste,
    paper: paperKg * emissionFactors.paper
  };

  const totalEmissions = Object.values(emissions).reduce((sum, emission) => sum + emission, 0);
  
  // Usar la absorción de árboles desde la configuración
  const treesNeeded = Math.ceil(totalEmissions / config.treeAbsorption);
  
  return {
    emissions,
    totalEmissions: Math.round(totalEmissions),
    treesNeeded,
    breakdown: {
      'Empleados': Math.round(emissions.employees),
      'Electricidad': Math.round(emissions.electricity),
      'Gas': Math.round(emissions.gas),
      'Transporte': Math.round(emissions.transport),
      'Vuelos': Math.round(emissions.flights),
      'Residuos': Math.round(emissions.waste),
      'Papel': Math.round(emissions.paper)
    }
  };
};
