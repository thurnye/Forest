import { Routes, Route } from 'react-router-dom';
import { AssessmentPage } from '@features/student/pages/AssessmentPage';
import { ExercisesListPage } from '@features/student/pages/ExercisesListPage';
import { ExerciseDetailPage } from '@features/student/pages/ExerciseDetailPage';
import { ProgressPage } from '@features/student/pages/ProgressPage';
import { DiagnosticWarmupPage } from '@features/student/pages/DiagnosticWarmupPage';
import { DiagnosticPlacementPage } from '@features/student/pages/DiagnosticPlacementPage';
import { DiagnosticResultsPage } from '@features/student/pages/DiagnosticResultsPage';
import { ExplorerMapPage } from '@features/explorer/pages/ExplorerMapPage';
import { WonderDetailPage } from '@features/explorer/pages/WonderDetailPage';
import { QuizModePage } from '@features/explorer/pages/QuizModePage';
import { MyPassportPage } from '@features/explorer/pages/MyPassportPage';
import { AchievementPage } from '@features/explorer/pages/AchievementPage';
import { JourneyMapPage } from '@features/explorer/pages/JourneyMapPage';
import { PixiWelcomePage } from '@features/pixi-welcome/pages/PixiWelcomePage';
import TestingPage from '@/features/student/pages/testingPage';
import StudentDashboard from '../pages/StudentDashboard';
// import { StudentDashboard_Old } from '../pages/StudentDashboard_Old';

/**
 * Student feature routes
 */
export const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="welcome" element={<PixiWelcomePage />} />
      <Route path="assessment" element={<AssessmentPage />} />
      <Route path="exercises" element={<ExercisesListPage />} />
      <Route path="exercises/:exerciseId" element={<ExerciseDetailPage />} />
      <Route path="progress" element={<ProgressPage />} />
      <Route path="diagnostic/warmup" element={<DiagnosticWarmupPage />} />
      <Route path="diagnostic/placement" element={<DiagnosticPlacementPage />} />
      <Route path="diagnostic/results" element={<DiagnosticResultsPage />} />
      <Route path="explorer" element={<ExplorerMapPage />} />
      <Route path="explorer/journey" element={<JourneyMapPage />} />
      <Route path="explorer/wonder/:wonderId" element={<WonderDetailPage />} />
      <Route path="explorer/quiz" element={<QuizModePage />} />
      <Route path="explorer/passport" element={<MyPassportPage />} />
      <Route path="explorer/achievement" element={<AchievementPage />} />
      <Route path="explorer/testingPage" element={<TestingPage />} />
    </Routes>
  );
};
