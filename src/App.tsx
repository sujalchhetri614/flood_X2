import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Landing from '@/pages/Landing';

import CitizenLogin from '@/pages/citizen/CitizenLogin';
import CitizenSignup from '@/pages/citizen/CitizenSignup';
import CitizenOTP from '@/pages/citizen/CitizenOTP';
import CreatePassword, { CitizenSuccess } from '@/pages/citizen/CreatePassword';
import ForgotPassword from '@/pages/citizen/ForgotPassword';
import ResetOTP from '@/pages/citizen/ResetOTP';
import ResetPassword from '@/pages/citizen/ResetPassword';

import CitizenDashboardPage from '@/pages/citizen/CitizenDashboardPage';
import CitizenMapPage from '@/pages/citizen/CitizenMapPage';
import CitizenForecastPage from '@/pages/citizen/CitizenForecastPage';
import CitizenSafeRoutePage from '@/pages/citizen/CitizenSafeRoutePage';
import CitizenAlertsPage from '@/pages/citizen/CitizenAlertsPage';
import CitizenReportPage from '@/pages/citizen/CitizenReportPage';
import CitizenReportsPage from '@/pages/citizen/CitizenReportsPage';
import CitizenProfilePage from '@/pages/citizen/CitizenProfilePage';

import AuthorityLogin from '@/pages/authority/AuthorityLogin';
import AuthorityForgotPassword from '@/pages/authority/AuthorityForgotPassword';
import AuthorityResetPassword from '@/pages/authority/AuthorityResetPassword';
import AuthorityDashboard from '@/pages/authority/AuthorityDashboard';
import AuthorityMapPage from '@/pages/authority/AuthorityMapPage';
import AuthorityForecastPage from '@/pages/authority/AuthorityForecastPage';
import AuthorityRoadsPage from '@/pages/authority/AuthorityRoadsPage';
import AuthorityInfrastructurePage from '@/pages/authority/AuthorityInfrastructurePage';
import AuthorityAnalyticsPage from '@/pages/authority/AuthorityAnalyticsPage';
import AuthorityResponsePage from '@/pages/authority/AuthorityResponsePage';
import AuthorityRoutesPage from '@/pages/authority/AuthorityRoutesPage';
import AuthorityAlertsPage from '@/pages/authority/AuthorityAlertsPage';
import AuthorityReportsPage from '@/pages/authority/AuthorityReportsPage';

const citizenProtected = (element: React.ReactNode) => (
  <ProtectedRoute role="citizen">{element}</ProtectedRoute>
);

const authorityProtected = (element: React.ReactNode) => (
  <ProtectedRoute role="authority">{element}</ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Citizen auth */}
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/signup" element={<CitizenSignup />} />
          <Route path="/citizen/verify-otp" element={<CitizenOTP />} />
          <Route path="/citizen/create-password" element={<CreatePassword />} />
          <Route path="/citizen/success" element={<CitizenSuccess />} />
          <Route path="/citizen/forgot-password" element={<ForgotPassword />} />
          <Route path="/citizen/reset-otp" element={<ResetOTP />} />
          <Route path="/citizen/reset-password" element={<ResetPassword />} />

          {/* Citizen app */}
          <Route path="/citizen" element={citizenProtected(<CitizenDashboardPage />)} />
          <Route path="/citizen/dashboard" element={citizenProtected(<CitizenDashboardPage />)} />
          <Route path="/citizen/map" element={citizenProtected(<CitizenMapPage />)} />
          <Route path="/citizen/forecast" element={citizenProtected(<CitizenForecastPage />)} />
          <Route path="/citizen/safe-route" element={citizenProtected(<CitizenSafeRoutePage />)} />
          <Route path="/citizen/alerts" element={citizenProtected(<CitizenAlertsPage />)} />
          <Route path="/citizen/report" element={citizenProtected(<CitizenReportPage />)} />
          <Route path="/citizen/reports" element={citizenProtected(<CitizenReportsPage />)} />
          <Route path="/citizen/profile" element={citizenProtected(<CitizenProfilePage />)} />

          {/* Authority auth */}
          <Route path="/authority/login" element={<AuthorityLogin />} />
          <Route path="/authority/forgot-password" element={<AuthorityForgotPassword />} />
          <Route path="/authority/reset-password" element={<AuthorityResetPassword />} />

          {/* Authority app */}
          <Route path="/authority" element={authorityProtected(<AuthorityDashboard />)} />
          <Route path="/authority/dashboard" element={authorityProtected(<AuthorityDashboard />)} />
          <Route path="/authority/map" element={authorityProtected(<AuthorityMapPage />)} />
          <Route path="/authority/forecast" element={authorityProtected(<AuthorityForecastPage />)} />
          <Route path="/authority/roads" element={authorityProtected(<AuthorityRoadsPage />)} />
          <Route path="/authority/infrastructure" element={authorityProtected(<AuthorityInfrastructurePage />)} />
          <Route path="/authority/analytics" element={authorityProtected(<AuthorityAnalyticsPage />)} />
          <Route path="/authority/response" element={authorityProtected(<AuthorityResponsePage />)} />
          <Route path="/authority/routes" element={authorityProtected(<AuthorityRoutesPage />)} />
          <Route path="/authority/alerts" element={authorityProtected(<AuthorityAlertsPage />)} />
          <Route path="/authority/reports" element={authorityProtected(<AuthorityReportsPage />)} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
