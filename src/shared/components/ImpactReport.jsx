import React from 'react';
import { motion } from 'framer-motion';
import { 
  TreePine, TrendingUp, Globe, Calendar, 
  Award, Leaf, BarChart3, X 
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';

const ImpactReport = ({ isOpen, onClose, companyData, trees }) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const totalCO2Offset = trees.length * 22; // kg CO2 por árbol
  const totalInvestment = trees.length * 12000; // CLP por árbol
  const countries = new Set(trees.map(tree => tree.country));
  
  // Datos por mes para el gráfico
  const monthlyData = trees.reduce((acc, tree) => {
    const month = new Date(tree.plantedAt).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const downloadPDF = () => {
    // Crear contenido HTML para el PDF
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Impacto Ambiental - ${companyData.companyName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
          .stat-card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 2em; font-weight: bold; color: #10b981; }
          .chart { margin: 30px 0; }
          .footer { margin-top: 50px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte de Impacto Ambiental ${currentYear}</h1>
          <h2>${companyData.companyName}</h2>
          <p>Generado el ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${trees.length}</div>
            <div>Árboles Plantados</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${totalCO2Offset} kg</div>
            <div>CO₂ Compensado</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${countries.size}</div>
            <div>Países Impactados</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">$${totalInvestment.toLocaleString()}</div>
            <div>Inversión Total (CLP)</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Este reporte certifica el compromiso ambiental de ${companyData.companyName}</p>
          <p>Miarbol - Plataforma de Compensación de Huella de Carbono</p>
        </div>
      </body>
      </html>
    `;

    // Crear y descargar el archivo
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-impacto-${companyData.companyName}-${currentYear}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Reporte de Impacto Ambiental {currentYear}</h2>
              <p className="text-green-100">{companyData.companyName}</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-green-200">
              <CardContent className="p-4 text-center">
                <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{trees.length}</div>
                <div className="text-sm text-green-600">Árboles Plantados</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">{totalCO2Offset} kg</div>
                <div className="text-sm text-blue-600">CO₂ Compensado</div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-4 text-center">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">{countries.size}</div>
                <div className="text-sm text-purple-600">Países Impactados</div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-800">${totalInvestment.toLocaleString()}</div>
                <div className="text-sm text-orange-600">Inversión Total (CLP)</div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Progreso Mensual {currentYear}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2 h-32">
                {monthNames.map((month, index) => {
                  const count = monthlyData[index] || 0;
                  const maxCount = Math.max(...Object.values(monthlyData), 1);
                  const height = (count / maxCount) * 100;
                  
                  return (
                    <div key={month} className="flex flex-col items-center">
                      <div className="flex-1 flex items-end">
                        <div 
                          className="w-full bg-green-500 rounded-t transition-all duration-300"
                          style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{month}</div>
                      <div className="text-xs font-semibold text-green-700">{count}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Resumen de Impacto</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800">Equivalente a retirar {Math.round(totalCO2Offset / 4600)} autos de la carretera por un año</span>
                  <span className="text-green-600 font-semibold">{totalCO2Offset} kg CO₂</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800">Oxígeno generado para {Math.round(trees.length / 2)} personas por un año</span>
                  <span className="text-blue-600 font-semibold">{trees.length} árboles</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-800">Contribución a la biodiversidad en {countries.size} países</span>
                  <span className="text-purple-600 font-semibold">{Array.from(countries).join(', ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Descargar Reporte
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactReport;