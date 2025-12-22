import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '@app/stores/stores';
import { ProtectedRoute } from '@app/routes/ProtectedRoute';
import { PublicRoute } from '@app/routes/PublicRoute';
import { AuthRoutes } from '@features/auth/router/auth.routes';
import { StudentRoutes } from '@features/student/router/student.routes';
import { ParentTeacherRoutes } from '@features/parent_teacher/router/parent_teacher.routes';
import { UserRole } from '@shared/types/api.types';

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

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes - redirect if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/*" element={<AuthRoutes />} />
            </Route>

            {/* Student routes - protected */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={[UserRole.STUDENT]} />
              }
            >
              <Route path="*" element={<StudentRoutes />} />
            </Route>

            {/* Parent/Teacher routes - protected */}
            <Route
              path="/parent-teacher/*"
              element={
                <ProtectedRoute allowedRoles={[UserRole.PARENT, UserRole.TEACHER]} />
              }
            >
              <Route path="*" element={<ParentTeacherRoutes />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
