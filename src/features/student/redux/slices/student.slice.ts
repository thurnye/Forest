import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReadingLevel } from '@shared/types/api.types';
import { studentApiService } from '@features/student/services/student.api.service';

export interface Assessment {
  id: string;
  studentId: string;
  readingLevel: ReadingLevel;
  score: number;
  feedback: string;
  completedAt: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  readingLevel: ReadingLevel;
  content: string;
  questions: Question[];
  isCompleted: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
  correctAnswer?: string;
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  feedback: string;
  completedAt: string;
  startedAt: string;
  timeSpentSeconds: number; // Time from start to completion in seconds
}

export interface StudentProgress {
  studentId: string;
  currentLevel: ReadingLevel;
  exercisesCompleted: number;
  totalExercises: number;
  averageScore: number;
  lastActivityAt: string;
}

export interface Goal {
  id: string;
  studentId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: 'exercises' | 'score' | 'reading-time'; // Type of goal
  deadline: string;
  createdAt: string;
  createdBy: string; // Parent or teacher ID
  isCompleted: boolean;
}

interface StudentState {
  currentAssessment: Assessment | null;
  assessmentHistory: Assessment[];
  exercises: Exercise[];
  currentExercise: Exercise | null;
  progress: StudentProgress | null;
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  currentAssessment: null,
  assessmentHistory: [],
  exercises: [],
  currentExercise: null,
  progress: null,
  goals: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const takeAssessment = createAsyncThunk(
  'student/takeAssessment',
  async (answers: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await studentApiService.submitAssessment(answers);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Assessment submission failed');
    }
  }
);

export const fetchExercises = createAsyncThunk(
  'student/fetchExercises',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApiService.getExercises();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

export const fetchExerciseById = createAsyncThunk(
  'student/fetchExerciseById',
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      const response = await studentApiService.getExerciseById(exerciseId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exercise');
    }
  }
);

export const submitExercise = createAsyncThunk(
  'student/submitExercise',
  async (
    { exerciseId, answers, timeSpentSeconds }: { exerciseId: string; answers: Record<string, string>; timeSpentSeconds: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await studentApiService.submitExercise(exerciseId, answers, timeSpentSeconds);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Exercise submission failed');
    }
  }
);

export const fetchProgress = createAsyncThunk(
  'student/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApiService.getProgress();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch progress');
    }
  }
);

export const fetchGoals = createAsyncThunk(
  'student/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApiService.getGoals();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch goals');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentExercise: (state) => {
      state.currentExercise = null;
    },
  },
  extraReducers: (builder) => {
    // Take assessment
    builder
      .addCase(takeAssessment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(takeAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.currentAssessment = action.payload;
          state.assessmentHistory.push(action.payload);
        }
      })
      .addCase(takeAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch exercises
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload || [];
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch exercise by ID
    builder
      .addCase(fetchExerciseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExercise = action.payload || null;
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit exercise
    builder
      .addCase(submitExercise.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitExercise.fulfilled, (state, action) => {
        state.isLoading = false;
        // Mark exercise as completed
        if (action.payload) {
          const exerciseIndex = state.exercises.findIndex(
            (ex) => ex.id === action.payload?.exerciseId
          );
          if (exerciseIndex !== -1) {
            state.exercises[exerciseIndex].isCompleted = true;
          }
        }
      })
      .addCase(submitExercise.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch progress
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload || null;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch goals
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload || [];
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentExercise } = studentSlice.actions;
export default studentSlice.reducer;
