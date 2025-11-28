import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar';
import { Users, UserPlus, Mail, TreePine, Shield, User } from 'lucide-react';

const mockTeamMembers = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    role: 'Administrador',
    roleColor: 'bg-purple-100 text-purple-800',
    treesPlanted: 150,
    avatar: null,
    joinDate: '2023-06-15'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    role: 'Coordinador',
    roleColor: 'bg-blue-100 text-blue-800',
    treesPlanted: 85,
    avatar: null,
    joinDate: '2023-08-20'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    role: 'Miembro',
    roleColor: 'bg-green-100 text-green-800',
    treesPlanted: 45,
    avatar: null,
    joinDate: '2024-01-10'
  }
];

export default function CompanyTeamContent() {
  const totalTrees = mockTeamMembers.reduce((sum, member) => sum + member.treesPlanted, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Equipo de Empresa</h1>
          <p className="text-gray-600 mt-2">Gestiona los miembros de tu equipo y monitorea su participación</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Invitar Miembro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Total Miembros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mockTeamMembers.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Árboles del Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalTrees}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Promedio por Miembro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {Math.round(totalTrees / mockTeamMembers.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <div className="grid grid-cols-1 gap-4">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-800 text-lg font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800">{member.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${member.roleColor}`}>
                        {member.role === 'Administrador' && <Shield className="w-3 h-3 mr-1" />}
                        {member.role === 'Coordinador' && <Users className="w-3 h-3 mr-1" />}
                        {member.role === 'Miembro' && <User className="w-3 h-3 mr-1" />}
                        {member.role}
                      </span>

                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <TreePine className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">{member.treesPlanted}</span>
                        <span>árboles plantados</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                    Ver Perfil
                  </Button>
                  <p className="text-xs text-gray-500">
                    Miembro desde {new Date(member.joinDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Gestión de Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Roles disponibles:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Administrador:</strong> Acceso completo a todas las funciones de la empresa</li>
              <li><strong>Coordinador:</strong> Puede gestionar proyectos y ver reportes</li>
              <li><strong>Miembro:</strong> Puede plantar árboles y ver estadísticas del equipo</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}