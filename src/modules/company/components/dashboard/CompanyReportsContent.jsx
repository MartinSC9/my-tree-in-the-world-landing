import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { FileText, Download, TrendingUp, Leaf } from 'lucide-react';

const mockReports = [
  {
    id: 1,
    title: 'Reporte Trimestral Q1 2024',
    type: 'Trimestral',
    date: '2024-03-31',
    trees: 2500,
    co2Offset: 37500,
    status: 'Disponible'
  },
  {
    id: 2,
    title: 'Informe Anual 2023',
    type: 'Anual',
    date: '2023-12-31',
    trees: 8750,
    co2Offset: 131250,
    status: 'Disponible'
  },
  {
    id: 3,
    title: 'Reporte de Impacto Ambiental',
    type: 'Especial',
    date: '2024-02-15',
    trees: 3200,
    co2Offset: 48000,
    status: 'Disponible'
  }
];

export default function CompanyReportsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Reportes e Informes</h1>
        <p className="text-gray-600 mt-2">Descarga reportes detallados sobre tu impacto ambiental y actividades de reforestación</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Reportes Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mockReports.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Total Árboles Reportados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockReports.reduce((sum, r) => sum + r.trees, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">CO2 Compensado (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockReports.reduce((sum, r) => sum + r.co2Offset, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-purple-800">{report.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {report.type}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-gray-600">Árboles</p>
                      <p className="font-semibold">{report.trees.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-gray-600">CO2 (kg)</p>
                      <p className="font-semibold">{report.co2Offset.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Fecha: {new Date(report.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Sobre los Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Los reportes incluyen información detallada sobre árboles plantados, CO2 compensado,
            ubicaciones de plantación, y análisis de impacto ambiental. Todos los reportes están
            disponibles en formato PDF y pueden ser utilizados para presentaciones, auditorías
            ambientales o informes corporativos de sostenibilidad.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}