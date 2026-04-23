import { lazy, type ReactNode, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-hu/mui/styles';
import { createHuGoTheme } from '@material-hu/theme/hugo';

import { DialogLayerProvider } from '@material-hu/components/layers/Dialogs';
import { DrawerLayerProvider } from '@material-hu/components/layers/Drawers';
import { MenuLayerProvider } from '@material-hu/components/layers/Menus';

import { HomePage } from './pages/Home';
import { AuthProvider, useAuth } from './providers/AuthContext';
import './i18n';

const theme = createHuGoTheme();
const queryClient = new QueryClient();

const LoginPage = lazy(() => import('./pages/Auth/Login'));
const ProcessList = lazy(() => import('./pages/Processes/List'));
const ProcessDetail = lazy(() => import('./pages/Processes/Detail'));
const OperatorHome = lazy(() => import('./pages/Operator/Home'));
const CertificationDetail = lazy(
  () => import('./pages/Operator/CertificationDetail'),
);
const OperatorProcesses = lazy(() => import('./pages/Operator/Processes'));
const OperatorProcessDetail = lazy(
  () => import('./pages/Operator/ProcessDetail'),
);
const OperatorHistory = lazy(() => import('./pages/Operator/History'));
const OroBandeja = lazy(() => import('./pages/ORO/Bandeja'));
const OroEvaluation = lazy(() => import('./pages/ORO/Evaluation'));
const OroSignature = lazy(() => import('./pages/ORO/Signature'));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  return <>{children}</>;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MenuLayerProvider>
          <DialogLayerProvider>
            <DrawerLayerProvider>
              <BrowserRouter>
                <AuthProvider>
                  <Suspense fallback={null}>
                    <Routes>
                      <Route
                        path="/login"
                        element={<LoginPage />}
                      />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <HomePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/processes"
                        element={
                          <ProtectedRoute>
                            <ProcessList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/processes/:id"
                        element={
                          <ProtectedRoute>
                            <ProcessDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator"
                        element={
                          <ProtectedRoute>
                            <OperatorHome />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/certifications/:id"
                        element={
                          <ProtectedRoute>
                            <CertificationDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/processes"
                        element={
                          <ProtectedRoute>
                            <OperatorProcesses />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/processes/:processId"
                        element={
                          <ProtectedRoute>
                            <OperatorProcessDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/history"
                        element={
                          <ProtectedRoute>
                            <OperatorHistory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro"
                        element={
                          <ProtectedRoute>
                            <OroBandeja />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro/evaluation/:requestId"
                        element={
                          <ProtectedRoute>
                            <OroEvaluation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro/signature/:requestId"
                        element={
                          <ProtectedRoute>
                            <OroSignature />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </AuthProvider>
              </BrowserRouter>
            </DrawerLayerProvider>
          </DialogLayerProvider>
        </MenuLayerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
