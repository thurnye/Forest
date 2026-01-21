import { Routes, Route } from 'react-router-dom';
import { ParentTeacherDashboard } from '@/features/guardian/pages/GuardianDashboard';
import { StudentListPage } from '@features/guardian/pages/StudentListPage';
import { StudentDetailPage } from '@features/guardian/pages/StudentDetailPage';
import { AssignExercisePage } from '@features/guardian/pages/AssignExercisePage';
import { SetGoalPage } from '@features/guardian/pages/SetGoalPage';

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
