import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@core/contexts/AuthContext';
import { TreeProvider } from '@core/contexts/TreeContext';
import { ThemeProvider } from '@core/contexts/ThemeContext';
import DynamicMetaTags from '@shared/components/DynamicMetaTags';
import ScrollToTop from '@shared/components/ScrollToTop';
import ErrorBoundary from '@shared/components/ErrorBoundary';

// Landing pages - lazy loaded
const LandingHome = lazy(() => import('@/pages/landing/LandingHome'));
const AboutPage = lazy(() => import('@/pages/landing/AboutPage'));
const EmpresasPage = lazy(() => import('@/pages/landing/EmpresasPage'));
const SorteosPage = lazy(() => import('@/pages/landing/SorteosPage'));
const ContactoPage = lazy(() => import('@/pages/landing/ContactoPage'));
const ReferidosPage = lazy(() => import('@/pages/landing/ReferidosPage'));
const QRProductosPage = lazy(() => import('@/pages/landing/QRProductosPage'));
const TerminosPage = lazy(() => import('@/pages/landing/TerminosPage'));
const PrivacidadPage = lazy(() => import('@/pages/landing/PrivacidadPage'));
const SeguridadInfantilPage = lazy(() => import('@/pages/landing/SeguridadInfantilPage'));
const ViverosPage = lazy(() => import('@/pages/landing/ViverosPage'));
const PlantadoresPage = lazy(() => import('@/pages/landing/PlantadoresPage'));
const ChapistasPage = lazy(() => import('@/pages/landing/ChapistasPage'));
const ColaborativosPage = lazy(() => import('@/pages/landing/ColaborativosPage'));

// Public pages - lazy loaded
const UnifiedMapPage = lazy(() => import('@features/trees/pages/UnifiedMapPage'));
const CertificatePage = lazy(() => import('@features/certificates/pages/CertificatePage'));

// Components
import DarkLayout from '@shared/components/layout/DarkLayout';
// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TreeProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <DynamicMetaTags />
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Landing pages (public) */}
                  <Route path="/" element={<LandingHome />} />
                  <Route
                    path="/sobre-nosotros"
                    element={
                      <DarkLayout>
                        <AboutPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/colaborativos"
                    element={
                      <DarkLayout>
                        <ColaborativosPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/empresas"
                    element={
                      <DarkLayout>
                        <EmpresasPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/sorteos"
                    element={
                      <DarkLayout>
                        <SorteosPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/contacto"
                    element={
                      <DarkLayout>
                        <ContactoPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/referidos"
                    element={
                      <DarkLayout>
                        <ReferidosPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/qr-productos"
                    element={
                      <DarkLayout>
                        <QRProductosPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/viveros"
                    element={
                      <DarkLayout>
                        <ViverosPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/plantadores"
                    element={
                      <DarkLayout>
                        <PlantadoresPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/chapistas"
                    element={
                      <DarkLayout>
                        <ChapistasPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/mapa/:treeId?"
                    element={
                      <DarkLayout>
                        <UnifiedMapPage />
                      </DarkLayout>
                    }
                  />

                  {/* Legal pages (public) */}
                  <Route
                    path="/terminos"
                    element={
                      <DarkLayout>
                        <TerminosPage />
                      </DarkLayout>
                    }
                  />
                  <Route
                    path="/privacidad"
                    element={
                      <DarkLayout>
                        <PrivacidadPage />
                      </DarkLayout>
                    }
                  />

                  <Route
                    path="/seguridad-infantil"
                    element={
                      <DarkLayout>
                        <SeguridadInfantilPage />
                      </DarkLayout>
                    }
                  />

                  {/* Certificate page (public) */}
                  <Route path="/certificado/:treeId" element={<CertificatePage />} />

                  {/* Redirect all other routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Router>
        </TreeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
