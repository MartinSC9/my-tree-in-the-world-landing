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

// Public pages - lazy loaded
const UnifiedMapPage = lazy(() => import('@features/trees/pages/UnifiedMapPage'));
const CertificatePage = lazy(() => import('@features/certificates/pages/CertificatePage'));

// Components
import AuthenticatedLayout from '@shared/components/layout/AuthenticatedLayout';
import ChatBot from '@shared/components/ChatBot/ChatBot';

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
                  <Route
                    path="/"
                    element={
                      <AuthenticatedLayout>
                        <LandingHome />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/sobre-nosotros"
                    element={
                      <AuthenticatedLayout>
                        <AboutPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/empresas"
                    element={
                      <AuthenticatedLayout>
                        <EmpresasPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/sorteos"
                    element={
                      <AuthenticatedLayout>
                        <SorteosPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/contacto"
                    element={
                      <AuthenticatedLayout>
                        <ContactoPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/referidos"
                    element={
                      <AuthenticatedLayout>
                        <ReferidosPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/qr-productos"
                    element={
                      <AuthenticatedLayout>
                        <QRProductosPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/viveros"
                    element={
                      <AuthenticatedLayout>
                        <ViverosPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/plantadores"
                    element={
                      <AuthenticatedLayout>
                        <PlantadoresPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/chapistas"
                    element={
                      <AuthenticatedLayout>
                        <ChapistasPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/mapa/:treeId?"
                    element={
                      <AuthenticatedLayout>
                        <UnifiedMapPage />
                      </AuthenticatedLayout>
                    }
                  />

                  {/* Legal pages (public) */}
                  <Route
                    path="/terminos"
                    element={
                      <AuthenticatedLayout>
                        <TerminosPage />
                      </AuthenticatedLayout>
                    }
                  />
                  <Route
                    path="/privacidad"
                    element={
                      <AuthenticatedLayout>
                        <PrivacidadPage />
                      </AuthenticatedLayout>
                    }
                  />

                  <Route
                    path="/seguridad-infantil"
                    element={
                      <AuthenticatedLayout>
                        <SeguridadInfantilPage />
                      </AuthenticatedLayout>
                    }
                  />

                  {/* Certificate page (public) */}
                  <Route path="/certificado/:treeId" element={<CertificatePage />} />

                  {/* Redirect all other routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            {/* Chatbot flotante */}
            <ChatBot />
          </Router>
        </TreeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
