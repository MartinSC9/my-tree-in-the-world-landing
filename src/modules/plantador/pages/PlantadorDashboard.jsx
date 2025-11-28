import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@core/contexts/AuthContext';
import Navbar from '@shared/components/layout/Navbar';
import DashboardLayout from '@shared/components/layout/DashboardLayout';

// Import plantador content components
import PlantadorDashboardContent from '../components/dashboard/PlantadorDashboardContent';
import PlantadorPendingContent from '../components/dashboard/PlantadorPendingContent';
import PlantadorActiveContent from '../components/dashboard/PlantadorActiveContent';
import PlantadorCompletedContent from '../components/dashboard/PlantadorCompletedContent';
import PlantadorMapContent from '../components/dashboard/PlantadorMapContent';
import PlantadorStatsContent from '../components/dashboard/PlantadorStatsContent';

const PlantadorDashboard = () => {
  const { user } = useAuth();
  const { userId } = useParams();

  // Verificar que el usuario sea un plantador
  if (!user || user.role !== 'plantador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <Routes>
          {/* Mi Dashboard */}
          <Route path="/dashboard" element={<PlantadorDashboardContent />} />

          {/* Órdenes Pendientes */}
          <Route path="/pendientes" element={<PlantadorPendingContent />} />

          {/* En Proceso */}
          <Route path="/activas" element={<PlantadorActiveContent />} />

          {/* Completadas */}
          <Route path="/completadas" element={<PlantadorCompletedContent />} />

          {/* Mapa de Zonas */}
          <Route path="/mapa" element={<PlantadorMapContent />} />

          {/* Mis Estadísticas */}
          <Route path="/estadisticas" element={<PlantadorStatsContent />} />

          {/* Redirect raíz a dashboard */}
          <Route path="/" element={<Navigate to={`/plantador/${userId}/dashboard`} replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default PlantadorDashboard;
