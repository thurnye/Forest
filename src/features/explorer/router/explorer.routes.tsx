import { Route, Routes } from 'react-router-dom';
import { ExplorerMapPage } from '../pages/ExplorerMapPage';
import { WonderDetailPage } from '../pages/WonderDetailPage';
import { QuizModePage } from '../pages/QuizModePage';
import { MyPassportPage } from '../pages/MyPassportPage';
import { AchievementPage } from '../pages/AchievementPage';
import { JourneyMapPage } from '../pages/JourneyMapPage';


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
