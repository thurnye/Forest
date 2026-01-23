import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load page components
const WelcomePage = lazy(() => import('../pages/WelcomePage').then(m => ({ default: m.WelcomePage })));
const GuardianSignIn = lazy(() => import('@/features/auth/pages/GuardianSignIn').then(m => ({ default: m.GuardianSignIn })));
const StudentSignInPage = lazy(() => import('../pages/StudentSignIn'));
const SignUpPage = lazy(() => import('@features/auth/pages/SignUpPage').then(m => ({ default: m.SignUpPage })));

/**
 * Auth feature routes
 */
export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login/guardian" element={<GuardianSignIn />} />
      <Route path="/login/student" element={<StudentSignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};
