import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@core/contexts/AuthContext';
import Navbar from '@shared/components/layout/Navbar';
import DashboardLayout from '@shared/components/layout/DashboardLayout';

// Import company content components
import CompanyDashboardContent from '../components/dashboard/CompanyDashboardContent';
import CompanyCarbonContent from '../components/dashboard/CompanyCarbonContent';
import CompanyProjectsContent from '../components/dashboard/CompanyProjectsContent';
import CompanyReportsContent from '../components/dashboard/CompanyReportsContent';
import CompanyTeamContent from '../components/dashboard/CompanyTeamContent';
import CompanyBillingContent from '../components/dashboard/CompanyBillingContent';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { userId } = useParams();

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <Routes>
          <Route path="/dashboard" element={<CompanyDashboardContent />} />
          <Route path="/carbono" element={<CompanyCarbonContent />} />
          <Route path="/proyectos" element={<CompanyProjectsContent />} />
          <Route path="/reportes" element={<CompanyReportsContent />} />
          <Route path="/equipo" element={<CompanyTeamContent />} />
          <Route path="/facturacion" element={<CompanyBillingContent />} />
          <Route path="/" element={<Navigate to={`/empresa/${userId}/dashboard`} replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default CompanyDashboard;
