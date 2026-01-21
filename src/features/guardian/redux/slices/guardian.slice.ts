import { createSlice } from '@reduxjs/toolkit';
import { ParentTeacherState } from '../../types/guardian.types';
import { assignExercise, createStudent, fetchAvailableExercises, fetchStudentDetail, fetchStudents, linkStudent, updateStudent } from './guardian.asyncThunk';

const initialState: ParentTeacherState = {
  students: [],
  selectedStudent: null,
  availableExercises: [],
  isLoading: false,
  error: null,
};

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
