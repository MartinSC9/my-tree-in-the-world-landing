import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';

const UserRewardsContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Premios</h1>
        <p className="text-gray-600 mt-1">Logros y recompensas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido en Desarrollo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Este módulo está en desarrollo. Próximamente estará disponible con todas las funcionalidades.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRewardsContent;
