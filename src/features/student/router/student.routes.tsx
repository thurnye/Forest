import { Routes, Route } from 'react-router-dom';
import { AssessmentPage } from '@features/student/pages/AssessmentPage';
import { ReadingComprehension } from '@/features/student/pages/ReadingComprehension';
import { ProgressPage } from '@features/student/pages/ProgressPage';
import { DiagnosisRoutes } from '@features/diagnosis/router/diagnosis.routes';
import { PixiWelcomePage } from '@features/pixi-welcome/pages/PixiWelcomePage';
import TestingPage from '@/features/student/pages/testingPage';
import StudentDashboard from '../pages/StudentDashboard';
import ReadStoryPage from '../pages/ReadStoryPage';
import { ExplorerRoutes } from '@/features/explorer/router/explorer.routes';

/**
 * Student feature routes
 */
export const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path='welcome' element={<PixiWelcomePage />} />
      <Route path='assessment' element={<AssessmentPage />} />
      <Route path='read-story' element={<ReadStoryPage />} />
      <Route path='read-story/:exerciseId' element={<ReadingComprehension />} />
      <Route path='progress' element={<ProgressPage />} />
      <Route path='diagnostic/*' element={<DiagnosisRoutes />} />
      <Route path='explorer/*' element={<ExplorerRoutes />} />
      <Route path='explorer/testingPage' element={<TestingPage />} />
    </Routes>
  );
};
