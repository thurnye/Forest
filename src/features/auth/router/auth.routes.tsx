import { Routes, Route } from 'react-router-dom';
import { GuardianSignIn } from '@/features/auth/pages/GuardianSignIn';
import { SignUpPage } from '@features/auth/pages/SignUpPage';
import { WelcomePage } from '../pages/WelcomePage';
import StudentSignInPage from '../pages/StudentSignIn';

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
