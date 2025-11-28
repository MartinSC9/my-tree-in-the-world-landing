import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { TreePine, MapPin, Calendar, Users, Plus } from 'lucide-react';

const mockProjects = [
  {
    id: 1,
    name: 'Reforestación Valle del Cauca',
    location: 'Valle del Cauca, Colombia',
    startDate: '2024-01-15',
    teamSize: 12,
    progress: 75,
    treesPlanted: 1500,
    treesGoal: 2000
  },
  {
    id: 2,
    name: 'Bosque Urbano Medellín',
    location: 'Medellín, Antioquia',
    startDate: '2024-03-01',
    teamSize: 8,
    progress: 45,
    treesPlanted: 450,
    treesGoal: 1000
  },
  {
    id: 3,
    name: 'Corredor Ecológico Amazonas',
    location: 'Amazonas, Colombia',
    startDate: '2024-02-10',
    teamSize: 15,
    progress: 60,
    treesPlanted: 3000,
    treesGoal: 5000
  }
];

export default function CompanyProjectsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Proyectos Activos</h1>
          <p className="text-gray-600 mt-2">Gestiona tus proyectos de reforestación y monitorea su progreso</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Total Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mockProjects.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Árboles Plantados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockProjects.reduce((sum, p) => sum + p.treesPlanted, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Miembros de Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockProjects.reduce((sum, p) => sum + p.teamSize, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-purple-800">{project.name}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Inicio: {new Date(project.startDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{project.teamSize} miembros del equipo</span>
                      </div>
                    </div>
                  </CardDescription>
                </div>
                <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                  Ver Detalles
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      {project.treesPlanted.toLocaleString()} / {project.treesGoal.toLocaleString()} árboles
                    </span>
                  </div>
                  <span className="font-semibold text-purple-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}