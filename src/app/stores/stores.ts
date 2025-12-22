import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/redux/slices/auth.slice';
import studentReducer from '@features/student/redux/slices/student.slice';
import parentTeacherReducer from '@features/parent_teacher/redux/slices/parent_teacher.slice';
import explorerReducer from '@features/explorer/redux/slices/explorer.slice';

/**
 * Centralized Redux store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    parentTeacher: parentTeacherReducer,
    explorer: explorerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
