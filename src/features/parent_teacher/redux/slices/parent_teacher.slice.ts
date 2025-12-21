import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Student } from '@shared/types/api.types';
import { parentTeacherApiService } from '@features/parent_teacher/services/parent_teacher.api.service';
import { Assessment, StudentProgress, Exercise, ExerciseAttempt } from '@features/student/redux/slices/student.slice';

export interface StudentDetail extends Student {
  progress: StudentProgress;
  recentAssessments: Assessment[];
  recentExerciseAttempts: ExerciseAttempt[];
}

interface ParentTeacherState {
  students: Student[];
  selectedStudent: StudentDetail | null;
  availableExercises: Exercise[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ParentTeacherState = {
  students: [],
  selectedStudent: null,
  availableExercises: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'parentTeacher/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await parentTeacherApiService.getStudents();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentDetail = createAsyncThunk(
  'parentTeacher/fetchStudentDetail',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await parentTeacherApiService.getStudentDetail(studentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch student detail');
    }
  }
);

export const linkStudent = createAsyncThunk(
  'parentTeacher/linkStudent',
  async (data: { studentEmail: string }, { rejectWithValue }) => {
    try {
      const response = await parentTeacherApiService.linkStudent(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to link student');
    }
  }
);

export const createStudent = createAsyncThunk(
  'parentTeacher/createStudent',
  async (
    data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      targetGradeLevel: import('@shared/types/api.types').ReadingLevel;
      diagnosticEnabled: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await parentTeacherApiService.createStudent(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create student');
    }
  }
);

export const assignExercise = createAsyncThunk(
  'parentTeacher/assignExercise',
  async (
    { studentId, exerciseId }: { studentId: string; exerciseId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await parentTeacherApiService.assignExercise(studentId, exerciseId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign exercise');
    }
  }
);

export const fetchAvailableExercises = createAsyncThunk(
  'parentTeacher/fetchAvailableExercises',
  async (_, { rejectWithValue }) => {
    try {
      const response = await parentTeacherApiService.getAvailableExercises();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'parentTeacher/updateStudent',
  async (
    data: {
      studentId: string;
      firstName: string;
      lastName: string;
      email: string;
      targetGradeLevel: import('@shared/types/api.types').ReadingLevel;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await parentTeacherApiService.updateStudent(data.studentId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        targetGradeLevel: data.targetGradeLevel,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update student');
    }
  }
);

const parentTeacherSlice = createSlice({
  name: 'parentTeacher',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload || [];
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch student detail
    builder
      .addCase(fetchStudentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedStudent = action.payload || null;
      })
      .addCase(fetchStudentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Link student
    builder
      .addCase(linkStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(linkStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.students.push(action.payload);
        }
      })
      .addCase(linkStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create student
    builder
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.students.push(action.payload);
        }
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign exercise
    builder
      .addCase(assignExercise.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignExercise.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignExercise.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch available exercises
    builder
      .addCase(fetchAvailableExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableExercises = action.payload || [];
      })
      .addCase(fetchAvailableExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update student
    builder
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Update in students list
          const index = state.students.findIndex((s) => s.id === action.payload!.id);
          if (index !== -1) {
            state.students[index] = action.payload;
          }
          // Update selected student if it's the same one
          if (state.selectedStudent && state.selectedStudent.id === action.payload.id) {
            state.selectedStudent = {
              ...state.selectedStudent,
              ...action.payload,
            };
          }
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedStudent } = parentTeacherSlice.actions;
export default parentTeacherSlice.reducer;
