import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/app.hooks';
import { UserRole } from '@shared/types/api.types';

/**
 * Public route component that redirects authenticated users to their dashboard
 */
export const PublicRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case UserRole.STUDENT:
        return <Navigate to="/student" replace />;
      case UserRole.PARENT:
      case UserRole.TEACHER:
        return <Navigate to="/parent-teacher" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};
