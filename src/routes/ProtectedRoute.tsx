import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  role: UserRole;
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || session?.role !== role) {
    return <Navigate to={role === 'citizen' ? '/citizen/login' : '/authority/login'} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
