import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/app.hooks';
import { UserRole } from '@shared/types/api.types';
import { CircularProgress, Box } from '@mui/material';

/**
 * Public route component that redirects authenticated users to their dashboard
 */
export const PublicRoute = () => {
  const { isAuthenticated, user, isLoading, hasBootstrapped } = useAppSelector(
    (state) => state.auth
  );

  // Wait for bootstrap to complete before making any decisions
  if (!hasBootstrapped || isLoading) {
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

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case UserRole.STUDENT:
        return <Navigate to="/student" replace />;
      case UserRole.PARENT:
      case UserRole.TEACHER:
        return <Navigate to="/parent-teacher" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
