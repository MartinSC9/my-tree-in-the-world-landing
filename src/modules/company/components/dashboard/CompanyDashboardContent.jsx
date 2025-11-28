import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { TreePine, TrendingUp, DollarSign, Globe, Download, FileText, Activity } from 'lucide-react';
import { DashboardStatsGrid } from '@shared/components/StatCard';

const CompanyDashboardContent = () => {
  const stats = {
    totalTrees: 387,
    totalInvestment: 4644000,
    co2Offset: 8514,
    countries: 5,
    activeProjects: 3,
    monthlyGrowth: 12
  };

  const statsCards = [
    { label: 'Árboles', value: stats.totalTrees, icon: TreePine, color: 'purple' },
    { label: 'Inversión', value: `$${(stats.totalInvestment / 1000).toFixed(0)}k`, icon: DollarSign, color: 'green' },
    { label: 'CO₂ Compensado', value: `${stats.co2Offset}kg`, icon: TrendingUp, color: 'blue' },
    { label: 'Países', value: stats.countries, icon: Globe, color: 'orange' },
    { label: 'Proyectos', value: stats.activeProjects, icon: FileText, color: 'indigo' },
    { label: 'Crecimiento', value: `+${stats.monthlyGrowth}%`, icon: Activity, color: 'red' },
  ];

  const recentActivity = [
    { id: 1, type: 'tree', message: 'Se plantaron 25 árboles en Argentina', date: 'Hace 2 horas', icon: TreePine, color: 'green' },
    { id: 2, type: 'report', message: 'Nuevo reporte de impacto generado', date: 'Hace 5 horas', icon: FileText, color: 'blue' },
    { id: 3, type: 'offset', message: 'Compensados 550kg de CO₂ este mes', date: 'Hace 1 día', icon: Activity, color: 'purple' }
  ];

  const activeProjects = [
    { id: 1, name: 'Reforestación Patagonia', trees: 150, progress: 75, location: 'Argentina' },
    { id: 2, name: 'Bosque Urbano Lima', trees: 80, progress: 45, location: 'Perú' },
    { id: 3, name: 'Selva Amazónica', trees: 120, progress: 90, location: 'Brasil' }
  ];

  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Panel Empresarial</h1>
        <p className="text-gray-600 mt-1">Vista general de tu impacto ambiental</p>
      </div>

      {/* Stats Cards */}
      <DashboardStatsGrid stats={statsCards} columns={6} />

      {/* Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.location} • {project.trees} árboles</p>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[activity.color]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <TreePine className="h-4 w-4 mr-2" />
              Plantar Árboles
            </Button>
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <Download className="h-4 w-4 mr-2" />
              Descargar Certificado
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <FileText className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboardContent;
