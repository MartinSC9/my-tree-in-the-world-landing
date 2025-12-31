import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TreePine,
  Globe,
  Users,
  Award,
  Leaf,
  Building2,
  Calculator,
  TrendingUp,
  CheckCircle,
  Mail,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { calculateCarbonFootprint } from '@/utils/carbonCalculator';
import { APP_URL } from '@core/config/app.config';
import Footer from '@shared/components/layout/Footer';

const EmpresasPage = () => {
  const [carbonData, setCarbonData] = useState({
    employees: '',
    electricityKwh: '',
    fuelLiters: '',
    gasolineLiters: '',
  });
  const [carbonResult, setCarbonResult] = useState(null);

  const handleCarbonCalculation = () => {
    const data = {
      employees: parseInt(carbonData.employees) || 0,
      electricityKwh: parseInt(carbonData.electricityKwh) || 0,
      vehicleKm: (parseInt(carbonData.fuelLiters) || 0) * 10, // Estimación: 1 litro = 10 km
      gasM3: (parseInt(carbonData.gasolineLiters) || 0) * 0.001, // Conversión aproximada
    };

    const result = calculateCarbonFootprint(data);
    setCarbonResult(result);
  };

  const handleInputChange = (field, value) => {
    setCarbonData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <Building2 className="h-14 w-14 mx-auto mb-4 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
              Empresas Sostenibles
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transformá tu empresa en un agente de cambio positivo para el medio ambiente. Compensá
              tu huella de carbono y demostrá tu compromiso real con la sostenibilidad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Información sobre huella de carbono */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
              ¿Qué es la huella de carbono?
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                La huella de carbono es la medida del impacto que provocan las actividades de tu
                empresa en el medio ambiente, expresada en toneladas de CO₂ emitidas. Estas
                emisiones contribuyen al cambio climático y al calentamiento global.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Al plantar árboles, tu empresa puede compensar estas emisiones, ya que los árboles
                absorben CO₂ durante su crecimiento, contribuyendo a mitigar el cambio climático y
                restaurar ecosistemas naturales.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculadora de Huella de Carbono */}
      <section className="py-10 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
              <h3 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-3">
                Calculadora de Huella de Carbono
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Estimá la huella de carbono de tu empresa y descubrí cuántos árboles necesitás
                plantar para compensarla.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulario */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-green-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Calculator className="h-5 w-5" />
                    <span>Ingresá los datos de tu empresa</span>
                  </CardTitle>
                  <p className="text-green-100 text-xs mt-1">
                    Completá el formulario para obtener una estimación mensual
                  </p>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <Label htmlFor="electricity">Electricidad consumida (kWh por mes)</Label>
                    <Input
                      id="electricity"
                      type="number"
                      placeholder="2000"
                      value={carbonData.electricityKwh}
                      onChange={(e) => handleInputChange('electricityKwh', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuel">Nafta utilizada en vehículos (litros por mes)</Label>
                    <Input
                      id="fuel"
                      type="number"
                      placeholder="500"
                      value={carbonData.fuelLiters}
                      onChange={(e) => handleInputChange('fuelLiters', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gasoline">Gasoil utilizado en vehículos (litros por mes)</Label>
                    <Input
                      id="gasoline"
                      type="number"
                      placeholder="300"
                      value={carbonData.gasolineLiters}
                      onChange={(e) => handleInputChange('gasolineLiters', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="employees">Cantidad de empleados</Label>
                    <Input
                      id="employees"
                      type="number"
                      placeholder="50"
                      value={carbonData.employees}
                      onChange={(e) => handleInputChange('employees', e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleCarbonCalculation}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Calcular Huella de Carbono
                  </Button>
                </CardContent>
              </Card>

              {/* Resultados */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-green-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <TrendingUp className="h-5 w-5" />
                    <span>Resultado del cálculo</span>
                  </CardTitle>
                  <p className="text-green-100 text-xs mt-1">Basado en los datos proporcionados</p>
                </CardHeader>
                <CardContent className="p-5">
                  {carbonResult ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1.5">
                          Tu empresa emite aproximadamente
                        </p>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {carbonResult.totalEmissions.toLocaleString()} kg
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">de CO₂ por mes</p>
                      </div>

                      <div className="text-center bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          Para compensar esa huella, se deberían plantar
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <TreePine className="h-7 w-7 text-green-600 dark:text-green-400" />
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {carbonResult.treesNeeded} árboles
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => window.open(`${APP_URL}/registro`, '_blank')}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Compensar mi huella ahora
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Link to="/contacto">
                            <Mail className="h-4 w-4 mr-2" />
                            Solicitar proyecto de reforestación empresarial
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Completá el formulario para ver los resultados
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Beneficios de compensar la huella de carbono */}
      <section className="py-10 px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-3">
                Beneficios de Compensar tu Huella de Carbono
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Más allá del impacto ambiental positivo, compensar tu huella de carbono trae
                múltiples beneficios para tu empresa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-green-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-center text-green-800 dark:text-green-400 text-lg">
                    Imagen Corporativa
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Demuestra compromiso ambiental real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mejora la percepción de marca</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Atrae clientes conscientes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg border-green-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-center text-green-800 dark:text-green-400 text-lg">
                    Ventajas Competitivas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cumplimiento de regulaciones ambientales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Acceso a mercados verdes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Diferenciación en licitaciones</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg border-green-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Leaf className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-center text-green-800 dark:text-green-400 text-lg">
                    Impacto Positivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Contribución real al medio ambiente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Certificados de compensación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Seguimiento del impacto generado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proyectos Colaborativos para Empresas */}
      <section className="py-10 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-3xl md:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-3">
                Proyectos Colaborativos Masivos
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Crea campañas de reforestación que involucren a tus clientes, empleados y comunidad.
                <span className="block mt-2 font-semibold text-purple-700 dark:text-purple-400">
                  Marketing ecológico + RSE + Engagement con sorteo de cupones
                </span>
              </p>
            </div>

            {/* How it works for companies */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 md:p-8 mb-8 border border-purple-200 dark:border-gray-700">
              <h4 className="text-2xl font-bold text-purple-800 dark:text-purple-400 mb-6 text-center">
                ¿Cómo Funciona?
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-purple-700 dark:text-purple-400">
                      1
                    </span>
                  </div>
                  <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">
                    Define tu Meta
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Elige cuántos árboles plantar (10-10,000+)
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-purple-700 dark:text-purple-400">
                      2
                    </span>
                  </div>
                  <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">
                    Aporte Inicial
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tu empresa aporta mínimo 30% del total
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-purple-700 dark:text-purple-400">
                      3
                    </span>
                  </div>
                  <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">
                    Configura Sorteo
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Define cupones de descuento para premiar
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-purple-700 dark:text-purple-400">
                      4
                    </span>
                  </div>
                  <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">
                    Usuarios Participan
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Clientes aportan y ganan chances de premios
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 text-center">
                  Ejemplo de Proyecto Colaborativo
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      <strong className="text-purple-700 dark:text-purple-400">Meta:</strong> 100
                      árboles × $18,000 = $1,800,000 ARS
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Empresa aporta 30% inicial = $540,000</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Quedan $1,260,000 para recaudar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>200 usuarios aportan (promedio $6,300 c/u)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
                      Al llegar al 100%:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Sorteo de 10 cupones (50% descuento)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>100 árboles plantados con tu branding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>200+ emails recolectados para CRM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Certificado colaborativo para todos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits comparison */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 md:p-8 border border-orange-200 dark:border-gray-700">
              <h4 className="text-2xl font-bold text-orange-800 dark:text-orange-400 mb-6 text-center">
                Diferencia con Árboles Individuales
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-orange-200">
                      <th className="text-left py-3 px-4 text-orange-800 dark:text-orange-400">
                        Característica
                      </th>
                      <th className="text-center py-3 px-4 text-orange-800 dark:text-orange-400">
                        Árboles Individuales
                      </th>
                      <th className="text-center py-3 px-4 text-orange-800 dark:text-orange-400 bg-orange-100 rounded-t-lg">
                        Proyectos Colaborativos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-b border-orange-100">
                      <td className="py-3 px-4 font-medium">Objetivo</td>
                      <td className="text-center py-3 px-4">Compensar huella de carbono</td>
                      <td className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-900/20">
                        Marketing + RSE + Engagement
                      </td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="py-3 px-4 font-medium">Proyectos simultáneos</td>
                      <td className="text-center py-3 px-4">N/A</td>
                      <td className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-900/20">
                        ✅ Ilimitados
                      </td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="py-3 px-4 font-medium">Sorteo de cupones</td>
                      <td className="text-center py-3 px-4">❌ No</td>
                      <td className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-900/20">
                        ✅ Sí (10%-50%)
                      </td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="py-3 px-4 font-medium">Participación clientes</td>
                      <td className="text-center py-3 px-4">❌ No</td>
                      <td className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-900/20">
                        ✅ Activa
                      </td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="py-3 px-4 font-medium">Recolección datos CRM</td>
                      <td className="text-center py-3 px-4">❌ No</td>
                      <td className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-900/20">
                        ✅ Sí
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Contenido RRSS</td>
                      <td className="text-center py-3 px-4">Básico</td>
                      <td className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-900/20">
                        ✅ Rico (campaña completa)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROI Section */}
            <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 md:p-8 text-white">
              <h4 className="text-2xl font-bold mb-4 text-center text-white">ROI de Marketing</h4>
              <p className="text-center mb-6 text-green-100">
                Con un proyecto colaborativo de $1,800,000 obtenés:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold mb-1">200+</p>
                  <p className="text-sm text-green-100">Usuarios comprometidos</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Mail className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold mb-1">200+</p>
                  <p className="text-sm text-green-100">Emails para CRM</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold mb-1">10</p>
                  <p className="text-sm text-green-100">Clientes fidelizados</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold mb-1">∞</p>
                  <p className="text-sm text-green-100">Contenido para RRSS</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Empresarial */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 md:p-8 text-white text-center"
          >
            <Building2 className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              ¿Listo para hacer la diferencia?
            </h2>
            <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto">
              Únete a las empresas que ya están compensando su huella de carbono y construyendo un
              futuro más sostenible
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-50 text-green-600 border-2 border-white shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Link to="/contacto">
                  <Mail className="h-4 w-4 mr-2" />
                  Solicitar Información Corporativa
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EmpresasPage;
