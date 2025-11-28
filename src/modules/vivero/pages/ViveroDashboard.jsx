import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@core/contexts/AuthContext';
import Navbar from '@shared/components/layout/Navbar';
import DashboardLayout from '@shared/components/layout/DashboardLayout';

// Import vivero content components
import ViveroDashboardContent from '../components/dashboard/ViveroDashboardContent';
import ViveroInventoryContent from '../components/dashboard/ViveroInventoryContent';
import ViveroOrdersContent from '../components/dashboard/ViveroOrdersContent';
import ViveroPreparationContent from '../components/dashboard/ViveroPreparationContent';
import ViveroReadyContent from '../components/dashboard/ViveroReadyContent';
import ViveroShipmentsContent from '../components/dashboard/ViveroShipmentsContent';

const ViveroDashboard = () => {
  const { user } = useAuth();
  const { userId } = useParams();

  // Verificar que el usuario sea un vivero
  if (!user || user.role !== 'vivero') {
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
          {/* Panel Principal */}
          <Route path="/dashboard" element={<ViveroDashboardContent />} />

          {/* Inventario */}
          <Route path="/inventario" element={<ViveroInventoryContent />} />

          {/* Órdenes Recibidas */}
          <Route path="/ordenes" element={<ViveroOrdersContent />} />

          {/* En Preparación */}
          <Route path="/preparacion" element={<ViveroPreparationContent />} />

          {/* Listos para Envío */}
          <Route path="/listos" element={<ViveroReadyContent />} />

          {/* Envíos */}
          <Route path="/envios" element={<ViveroShipmentsContent />} />

          {/* Redirect raíz a dashboard */}
          <Route path="/" element={<Navigate to={`/vivero/${userId}/dashboard`} replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default ViveroDashboard;
