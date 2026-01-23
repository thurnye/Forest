import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load page components
const StudentDashboard = lazy(() => import('../pages/StudentDashboard'));
const ReadStoryPage = lazy(() => import('../pages/ReadStoryPage'));
const TestingPage = lazy(() => import('@/features/student/pages/testingPage'));
const AssessmentPage = lazy(() => import('@features/student/pages/AssessmentPage').then(m => ({ default: m.AssessmentPage })));
const ReadingComprehension = lazy(() => import('@/features/student/pages/ReadingComprehension').then(m => ({ default: m.ReadingComprehension })));
const ProgressPage = lazy(() => import('@features/student/pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const PixiWelcomePage = lazy(() => import('@features/pixi-welcome/pages/PixiWelcomePage').then(m => ({ default: m.PixiWelcomePage })));

// Lazy load nested route components
const DiagnosisRoutes = lazy(() => import('@features/diagnosis/router/diagnosis.routes').then(m => ({ default: m.DiagnosisRoutes })));
const ExplorerRoutes = lazy(() => import('@/features/explorer/router/explorer.routes').then(m => ({ default: m.ExplorerRoutes })));

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
