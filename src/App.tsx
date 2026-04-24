import { lazy, type ReactNode, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-hu/mui/styles';
import { createHuGoTheme } from '@material-hu/theme/hugo';

import { DialogLayerProvider } from '@material-hu/components/layers/Dialogs';
import { DrawerLayerProvider } from '@material-hu/components/layers/Drawers';
import { MenuLayerProvider } from '@material-hu/components/layers/Menus';

import { HomePage } from './pages/Home';
import { AuthProvider, type UserRole, useAuth } from './providers/AuthContext';
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
const OroHistory = lazy(() => import('./pages/ORO/History'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const SupervisorDashboard = lazy(() => import('./pages/Supervisor/Dashboard'));
const EmployeeDrill = lazy(() => import('./pages/Supervisor/EmployeeDrill'));

function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: UserRole[];
}) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  if (roles && !roles.includes(user.role))
    return (
      <Navigate
        to="/"
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
                          <ProtectedRoute roles={['operator']}>
                            <OperatorHome />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/certifications/:id"
                        element={
                          <ProtectedRoute roles={['operator']}>
                            <CertificationDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/processes"
                        element={
                          <ProtectedRoute roles={['operator']}>
                            <OperatorProcesses />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/processes/:processId"
                        element={
                          <ProtectedRoute roles={['operator']}>
                            <OperatorProcessDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/operator/history"
                        element={
                          <ProtectedRoute roles={['operator']}>
                            <OperatorHistory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro"
                        element={
                          <ProtectedRoute roles={['oro']}>
                            <OroBandeja />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro/evaluation/:requestId"
                        element={
                          <ProtectedRoute roles={['oro']}>
                            <OroEvaluation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro/signature/:requestId"
                        element={
                          <ProtectedRoute roles={['oro']}>
                            <OroSignature />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/oro/history"
                        element={
                          <ProtectedRoute roles={['oro']}>
                            <OroHistory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supervisor"
                        element={
                          <ProtectedRoute roles={['supervisor']}>
                            <SupervisorDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/supervisor/employee/:operatorId"
                        element={
                          <ProtectedRoute roles={['supervisor']}>
                            <EmployeeDrill />
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
