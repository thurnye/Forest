import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load page components
const DiagnosticWarmupPage = lazy(() => import('@features/diagnosis/pages/DiagnosticWarmupPage').then(m => ({ default: m.DiagnosticWarmupPage })));
const DiagnosticPlacementPage = lazy(() => import('@features/diagnosis/pages/DiagnosticPlacementPage').then(m => ({ default: m.DiagnosticPlacementPage })));
const DiagnosticResultsPage = lazy(() => import('@features/diagnosis/pages/DiagnosticResultsPage').then(m => ({ default: m.DiagnosticResultsPage })));

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
