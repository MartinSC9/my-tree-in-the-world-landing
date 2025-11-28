import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useToast } from '@shared/components/ui/use-toast';
import { Activity, TrendingDown, Calculator, TreePine, Zap, Car, Plane, Flame, Trash2, FileText, Users } from 'lucide-react';
import carbonService from '../../services/carbonService';

const CompanyCarbonContent = () => {
  const [carbonData, setCarbonData] = useState({
    electricity: '',
    gas: '',
    vehicle: '',
    flight: '',
    waste: '',
    paper: '',
    employees: ''
  });

  const [calculatedFootprint, setCalculatedFootprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Stats (estos podrían venir de un endpoint separado en el futuro)
  const stats = {
    currentFootprint: 12450,
    offsetThisYear: 8514,
    remaining: 3936,
    treesPlanted: 387,
    percentage: 68
  };

  const handleInputChange = (field, value) => {
    setCarbonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateFootprint = async () => {
    // Validar que al menos un campo tenga valor
    const hasValues = Object.values(carbonData).some(val => val && parseFloat(val) > 0);

    if (!hasValues) {
      toast({
        title: "Datos requeridos",
        description: "Ingresa al menos un valor para calcular tu huella de carbono",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convertir valores a números (el backend espera formData como objeto)
      const formData = {
        electricity: parseFloat(carbonData.electricity) || 0,
        gas: parseFloat(carbonData.gas) || 0,
        vehicle: parseFloat(carbonData.vehicle) || 0,
        flight: parseFloat(carbonData.flight) || 0,
        waste: parseFloat(carbonData.waste) || 0,
        paper: parseFloat(carbonData.paper) || 0,
        employees: parseFloat(carbonData.employees) || 0
      };

      // Llamar a la API
      const result = await carbonService.calculate(formData);

      setCalculatedFootprint(result);

      toast({
        title: "Cálculo completado",
        description: `Tu huella de carbono es de ${result.totalCO2} kg CO₂/año`,
      });

    } catch (error) {
      console.error('Error calculando huella:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo calcular la huella de carbono",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Huella de Carbono</h1>
        <p className="text-gray-600 mt-1">Calcula y compensa tu impacto ambiental</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Huella Actual</p>
                <p className="text-3xl font-bold mt-1">{stats.currentFootprint}</p>
                <p className="text-red-100 text-xs">kg CO₂/año</p>
              </div>
              <Activity className="h-12 w-12 text-red-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Compensado</p>
                <p className="text-3xl font-bold mt-1">{stats.offsetThisYear}</p>
                <p className="text-green-100 text-xs">kg CO₂/año</p>
              </div>
              <TrendingDown className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Por Compensar</p>
                <p className="text-3xl font-bold mt-1">{stats.remaining}</p>
                <p className="text-orange-100 text-xs">kg CO₂/año</p>
              </div>
              <Activity className="h-12 w-12 text-orange-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Progreso</p>
                <p className="text-3xl font-bold mt-1">{stats.percentage}%</p>
                <p className="text-purple-100 text-xs">Compensado</p>
              </div>
              <TreePine className="h-12 w-12 text-purple-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carbon Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-600" />
            Calculadora de Huella de Carbono
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Ingresa los datos de consumo mensual de tu empresa para calcular tu huella de carbono
            </p>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Electricidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  Electricidad (kWh/mes)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.electricity}
                  onChange={(e) => handleInputChange('electricity', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Consumo eléctrico mensual</p>
              </div>

              {/* Gas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-600" />
                  Gas Natural (m³/mes)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.gas}
                  onChange={(e) => handleInputChange('gas', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Metros cúbicos de gas</p>
              </div>

              {/* Vehículos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Car className="h-4 w-4 text-blue-600" />
                  Transporte Vehicular (km/mes)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.vehicle}
                  onChange={(e) => handleInputChange('vehicle', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Kilómetros recorridos</p>
              </div>

              {/* Vuelos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-indigo-600" />
                  Vuelos (km/mes)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.flight}
                  onChange={(e) => handleInputChange('flight', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Distancia total en vuelos</p>
              </div>

              {/* Residuos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-gray-600" />
                  Residuos (kg/mes)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.waste}
                  onChange={(e) => handleInputChange('waste', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Kilogramos de residuos</p>
              </div>

              {/* Papel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  Papel (kg/mes)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.paper}
                  onChange={(e) => handleInputChange('paper', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Kilogramos de papel usado</p>
              </div>

              {/* Empleados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Número de Empleados
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={carbonData.employees}
                  onChange={(e) => handleInputChange('employees', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Total de empleados</p>
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateFootprint}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              <Calculator className="h-4 w-4 mr-2" />
              {loading ? 'Calculando...' : 'Calcular Huella de Carbono'}
            </Button>

            {/* Results */}
            {calculatedFootprint && (
              <div className="mt-6 p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-lg mb-4 text-purple-800">Resultados del Cálculo</h4>

                {/* Main Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-purple-300">
                    <p className="text-sm text-gray-600 mb-1">Huella Total Anual</p>
                    <p className="text-4xl font-bold text-purple-600">{calculatedFootprint.totalCO2}</p>
                    <p className="text-sm text-gray-500 mt-1">kg CO₂/año</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-green-300">
                    <p className="text-sm text-gray-600 mb-1">Árboles Necesarios</p>
                    <p className="text-4xl font-bold text-green-600">{calculatedFootprint.treesNeeded}</p>
                    <p className="text-sm text-gray-500 mt-1">para compensar 100%</p>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-sm text-gray-700 mb-3">Desglose por Categoría</h5>
                  <div className="space-y-2">
                    {calculatedFootprint.details.electricity > 0 && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">Electricidad</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.electricity} kg CO₂</span>
                      </div>
                    )}
                    {calculatedFootprint.details.gas > 0 && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">Gas Natural</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.gas} kg CO₂</span>
                      </div>
                    )}
                    {calculatedFootprint.details.vehicle > 0 && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Transporte Vehicular</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.vehicle} kg CO₂</span>
                      </div>
                    )}
                    {calculatedFootprint.details.flight > 0 && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm">Vuelos</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.flight} kg CO₂</span>
                      </div>
                    )}
                    {calculatedFootprint.details.waste > 0 && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">Residuos</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.waste} kg CO₂</span>
                      </div>
                    )}
                    {calculatedFootprint.details.paper > 0 && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Papel</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.paper} kg CO₂</span>
                      </div>
                    )}
                    {calculatedFootprint.details.employees > 0 && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">Empleados</span>
                        </div>
                        <span className="text-sm font-semibold">{calculatedFootprint.details.employees} kg CO₂</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <TreePine className="h-4 w-4 mr-2" />
                    Plantar {calculatedFootprint.treesNeeded} Árboles
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Compensa tu huella de carbono plantando árboles nativos
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyCarbonContent;
