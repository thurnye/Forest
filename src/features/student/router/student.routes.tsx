import { Routes, Route } from 'react-router-dom';
import { StudentDashboard } from '@features/student/pages/StudentDashboard';
import { AssessmentPage } from '@features/student/pages/AssessmentPage';
import { ExercisesListPage } from '@features/student/pages/ExercisesListPage';
import { ExerciseDetailPage } from '@features/student/pages/ExerciseDetailPage';
import { ProgressPage } from '@features/student/pages/ProgressPage';
import { DiagnosticWarmupPage } from '@features/student/pages/DiagnosticWarmupPage';
import { DiagnosticPlacementPage } from '@features/student/pages/DiagnosticPlacementPage';
import { DiagnosticResultsPage } from '@features/student/pages/DiagnosticResultsPage';

/**
 * Student feature routes
 */
export const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="assessment" element={<AssessmentPage />} />
      <Route path="exercises" element={<ExercisesListPage />} />
      <Route path="exercises/:exerciseId" element={<ExerciseDetailPage />} />
      <Route path="progress" element={<ProgressPage />} />
      <Route path="diagnostic/warmup" element={<DiagnosticWarmupPage />} />
      <Route path="diagnostic/placement" element={<DiagnosticPlacementPage />} />
      <Route path="diagnostic/results" element={<DiagnosticResultsPage />} />
    </Routes>
  );
};
