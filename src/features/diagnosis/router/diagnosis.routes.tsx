import { Routes, Route } from 'react-router-dom';
import { DiagnosticWarmupPage } from '@features/diagnosis/pages/DiagnosticWarmupPage';
import { DiagnosticPlacementPage } from '@features/diagnosis/pages/DiagnosticPlacementPage';
import { DiagnosticResultsPage } from '@features/diagnosis/pages/DiagnosticResultsPage';

/**
 * Diagnosis feature routes
 * These routes handle the diagnostic assessment flow for students
 */
export const DiagnosisRoutes = () => {
  return (
    <Routes>
      <Route path="warmup" element={<DiagnosticWarmupPage />} />
      <Route path="placement" element={<DiagnosticPlacementPage />} />
      <Route path="results" element={<DiagnosticResultsPage />} />
    </Routes>
  );
};
