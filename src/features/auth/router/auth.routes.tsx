import { Routes, Route } from 'react-router-dom';
import { SignInPage } from '@features/auth/pages/SignInPage';
import { SignUpPage } from '@features/auth/pages/SignUpPage';

/**
 * Auth feature routes
 */
export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};
