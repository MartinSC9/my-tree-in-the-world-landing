import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@shared/components/ui/toaster';
import { AuthProvider } from '@core/contexts/AuthContext';
import { TreeProvider } from '@core/contexts/TreeContext';
import { ThemeProvider } from '@core/contexts/ThemeContext';
import DynamicMetaTags from '@shared/components/DynamicMetaTags';
import ScrollToTop from '@shared/components/ScrollToTop';

// Landing pages
import LandingHome from '@/pages/landing/LandingHome';
import AboutPage from '@/pages/landing/AboutPage';
import EmpresasPage from '@/pages/landing/EmpresasPage';
import SorteosPage from '@/pages/landing/SorteosPage';
import ContactoPage from '@/pages/landing/ContactoPage';
import ReferidosPage from '@/pages/landing/ReferidosPage';
import QRProductosPage from '@/pages/landing/QRProductosPage';
import TerminosPage from '@/pages/landing/TerminosPage';
import PrivacidadPage from '@/pages/landing/PrivacidadPage';
import ViverosPage from '@/pages/landing/ViverosPage';
import PlantadoresPage from '@/pages/landing/PlantadoresPage';

// Public pages
import UnifiedMapPage from '@features/trees/pages/UnifiedMapPage';
import CertificatePage from '@features/certificates/pages/CertificatePage';

// Components
import AuthenticatedLayout from '@shared/components/layout/AuthenticatedLayout';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TreeProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <DynamicMetaTags />
            <Routes>
            {/* Landing pages (public) */}
            <Route path="/" element={
              <AuthenticatedLayout>
                <LandingHome />
              </AuthenticatedLayout>
            } />
            <Route path="/sobre-nosotros" element={
              <AuthenticatedLayout>
                <AboutPage />
              </AuthenticatedLayout>
            } />
            <Route path="/empresas" element={
              <AuthenticatedLayout>
                <EmpresasPage />
              </AuthenticatedLayout>
            } />
            <Route path="/sorteos" element={
              <AuthenticatedLayout>
                <SorteosPage />
              </AuthenticatedLayout>
            } />
            <Route path="/contacto" element={
              <AuthenticatedLayout>
                <ContactoPage />
              </AuthenticatedLayout>
            } />
            <Route path="/referidos" element={
              <AuthenticatedLayout>
                <ReferidosPage />
              </AuthenticatedLayout>
            } />
            <Route path="/qr-productos" element={
              <AuthenticatedLayout>
                <QRProductosPage />
              </AuthenticatedLayout>
            } />
            <Route path="/viveros" element={
              <AuthenticatedLayout>
                <ViverosPage />
              </AuthenticatedLayout>
            } />
            <Route path="/plantadores" element={
              <AuthenticatedLayout>
                <PlantadoresPage />
              </AuthenticatedLayout>
            } />
            <Route path="/mapa" element={
              <AuthenticatedLayout>
                <UnifiedMapPage />
              </AuthenticatedLayout>
            } />

            {/* Legal pages (public) */}
            <Route path="/terminos" element={
              <AuthenticatedLayout>
                <TerminosPage />
              </AuthenticatedLayout>
            } />
            <Route path="/privacidad" element={
              <AuthenticatedLayout>
                <PrivacidadPage />
              </AuthenticatedLayout>
            } />

            {/* Certificate page (public) */}
            <Route path="/certificado/:treeId" element={<CertificatePage />} />

            {/* Redirect all other routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
            <Toaster />
          </Router>
        </TreeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
