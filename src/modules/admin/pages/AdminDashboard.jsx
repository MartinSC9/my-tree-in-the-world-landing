import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@core/contexts/AuthContext';
import Navbar from '@shared/components/layout/Navbar';
import DashboardLayout from '@shared/components/layout/DashboardLayout';

// Import admin content components
import AdminDashboardContent from '../components/dashboard/AdminDashboardContent';
import AdminUsersContent from '../components/dashboard/AdminUsersContent';
import AdminTreesContent from '../components/dashboard/AdminTreesContent';
import AdminWorkOrdersContent from '../components/dashboard/AdminWorkOrdersContent';
import AdminReportsContent from '../components/dashboard/AdminReportsContent';
import AdminModerationContent from '../components/dashboard/AdminModerationContent';
import AdminProfileApprovalsContent from '../components/dashboard/AdminProfileApprovalsContent';
import AdminDatabaseContent from '../components/dashboard/AdminDatabaseContent';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { userId } = useParams();

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <Routes>
          <Route path="/dashboard" element={<AdminDashboardContent />} />
          <Route path="/usuarios" element={<AdminUsersContent />} />
          <Route path="/arboles" element={<AdminTreesContent />} />
          <Route path="/ordenes" element={<AdminWorkOrdersContent />} />
          <Route path="/reportes" element={<AdminReportsContent />} />
          <Route path="/moderacion" element={<AdminModerationContent />} />
          <Route path="/aprobaciones" element={<AdminProfileApprovalsContent />} />
          <Route path="/database" element={<AdminDatabaseContent />} />
          <Route path="/" element={<Navigate to={`/admin/${userId}/dashboard`} replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
