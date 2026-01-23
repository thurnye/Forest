import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load page components
const ParentTeacherDashboard = lazy(() => import('@/features/guardian/pages/GuardianDashboard').then(m => ({ default: m.ParentTeacherDashboard })));
const StudentListPage = lazy(() => import('@features/guardian/pages/StudentListPage').then(m => ({ default: m.StudentListPage })));
const StudentDetailPage = lazy(() => import('@features/guardian/pages/StudentDetailPage').then(m => ({ default: m.StudentDetailPage })));
const AssignExercisePage = lazy(() => import('@features/guardian/pages/AssignExercisePage').then(m => ({ default: m.AssignExercisePage })));
const SetGoalPage = lazy(() => import('@features/guardian/pages/SetGoalPage').then(m => ({ default: m.SetGoalPage })));

/**
 * Parent/Teacher feature routes
 */
export const ParentTeacherRoutes = () => {
  return (
    <Routes>
      <Route index element={<ParentTeacherDashboard />} />
      <Route path='students' element={<StudentListPage />} />
      <Route path='students/:studentId' element={<StudentDetailPage />} />
      <Route
        path='students/:studentId/assign'
        element={<AssignExercisePage />}
      />
      <Route path='students/:studentId/set-goal' element={<SetGoalPage />} />
    </Routes>
  );
};
