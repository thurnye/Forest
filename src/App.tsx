import { useEffect, useRef, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '@app/stores/stores';
import { useAppDispatch } from '@app/hooks/app.hooks';
import { ProtectedRoute } from '@app/routes/ProtectedRoute';
import { PublicRoute } from '@app/routes/PublicRoute';
import { AuthRoutes } from '@features/auth/router/auth.routes';
import { StudentRoutes } from '@features/student/router/student.routes';
import { ParentTeacherRoutes } from '@features/guardian/router/guardian.routes';
import { UserRole } from '@shared/types/api.types';
import { bootstrapAuth } from '@features/auth/redux/slices/auth.asyncThunks';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Forest green
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Loading fallback component for lazy-loaded routes
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

/**
 * AuthBootstrap - Attempts to restore auth session on app load
 * Uses ref to prevent double-call in React StrictMode
 */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      dispatch(bootstrapAuth());
    }
  }, [dispatch]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
            {/* Public routes - redirect if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path='/*' element={<AuthRoutes />} />
            </Route>

            {/* Student routes - protected */}
            <Route
              path='/student/*'
              element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]} />}
            >
              <Route path='*' element={<StudentRoutes />} />
            </Route>

            {/* Parent/Teacher routes - protected */}
            <Route
              path='/parent-teacher/*'
              element={
                <ProtectedRoute
                  allowedRoles={[UserRole.PARENT, UserRole.TEACHER]}
                />
              }
            >
              <Route path='*' element={<ParentTeacherRoutes />} />
            </Route>

            {/* Fallback route */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthBootstrap>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </AuthBootstrap>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
