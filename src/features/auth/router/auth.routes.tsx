import { Routes, Route } from 'react-router-dom';
import { Parent_Teacher_SignInPage } from '@/features/auth/pages/Parent_Teacher_SignInPage';
import { SignUpPage } from '@features/auth/pages/SignUpPage';
import { WelcomePage } from '../pages/WelcomePage';
import StudentSignInPage from '../pages/StudentSignInPage';

/**
 * Auth feature routes
 */
export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login/guardian" element={<Parent_Teacher_SignInPage />} />
      <Route path="/login/student" element={<StudentSignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};
