import { Routes, Route } from 'react-router-dom';
import { ParentTeacherDashboard } from '@features/parent_teacher/pages/ParentTeacherDashboard';
import { StudentListPage } from '@features/parent_teacher/pages/StudentListPage';
import { StudentDetailPage } from '@features/parent_teacher/pages/StudentDetailPage';
import { AssignExercisePage } from '@features/parent_teacher/pages/AssignExercisePage';
import { SetGoalPage } from '@features/parent_teacher/pages/SetGoalPage';

/**
 * Parent/Teacher feature routes
 */
export const ParentTeacherRoutes = () => {
  return (
    <Routes>
      <Route index element={<ParentTeacherDashboard />} />
      <Route path="students" element={<StudentListPage />} />
      <Route path="students/:studentId" element={<StudentDetailPage />} />
      <Route path="students/:studentId/assign" element={<AssignExercisePage />} />
      <Route path="students/:studentId/set-goal" element={<SetGoalPage />} />
    </Routes>
  );
};
