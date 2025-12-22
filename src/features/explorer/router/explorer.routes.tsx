import { RouteObject } from 'react-router-dom';
import { ExplorerMapPage } from '../pages/ExplorerMapPage';
import { WonderDetailPage } from '../pages/WonderDetailPage';
import { QuizModePage } from '../pages/QuizModePage';
import { MyPassportPage } from '../pages/MyPassportPage';
import { AchievementPage } from '../pages/AchievementPage';

export const explorerRoutes: RouteObject[] = [
  {
    path: 'explorer',
    children: [
      {
        path: '',
        element: <ExplorerMapPage />,
      },
      {
        path: 'wonder/:wonderId',
        element: <WonderDetailPage />,
      },
      {
        path: 'quiz',
        element: <QuizModePage />,
      },
      {
        path: 'passport',
        element: <MyPassportPage />,
      },
      {
        path: 'achievement',
        element: <AchievementPage />,
      },
    ],
  },
];
