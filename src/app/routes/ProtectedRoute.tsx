import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/app.hooks';
import { UserRole } from '@shared/types/api.types';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Protected route component that checks authentication and role-based access
 */
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
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
