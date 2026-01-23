import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy load page components
const ExplorerMapPage = lazy(() => import('../pages/ExplorerMapPage').then(m => ({ default: m.ExplorerMapPage })));
const JourneyMapPage = lazy(() => import('../pages/JourneyMapPage').then(m => ({ default: m.JourneyMapPage })));
const WonderDetailPage = lazy(() => import('../pages/WonderDetailPage').then(m => ({ default: m.WonderDetailPage })));
const QuizModePage = lazy(() => import('../pages/QuizModePage').then(m => ({ default: m.QuizModePage })));
const MyPassportPage = lazy(() => import('../pages/MyPassportPage').then(m => ({ default: m.MyPassportPage })));
const AchievementPage = lazy(() => import('../pages/AchievementPage').then(m => ({ default: m.AchievementPage })));

export const ExplorerRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<ExplorerMapPage />} />
      <Route path='journey' element={<JourneyMapPage />} />
      <Route path='wonder/:wonderId' element={<WonderDetailPage />} />
      <Route path='quiz' element={<QuizModePage />} />
      <Route path='passport' element={<MyPassportPage />} />
      <Route path='achievement' element={<AchievementPage />} />
    </Routes>
  );
};
