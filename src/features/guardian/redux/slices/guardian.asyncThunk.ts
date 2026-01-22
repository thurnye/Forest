import { createAsyncThunk } from '@reduxjs/toolkit';
import { parentTeacherApiService } from '@features/guardian/services/guardian.api.service';

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
  },
);

export const fetchStudentDetail = createAsyncThunk(
  'parentTeacher/fetchStudentDetail',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response =
        await parentTeacherApiService.getStudentDetail(studentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch student detail');
    }
  },
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
  },
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
    { rejectWithValue },
  ) => {
    try {
      // Use registerStudent instead of createStudent (student registration via auth-service)
      const response = await parentTeacherApiService.registerStudent({
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        targetGradeLevel: data.targetGradeLevel,
        diagnosticEnabled: data.diagnosticEnabled,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create student');
    }
  },
);

export const assignExercise = createAsyncThunk(
  'parentTeacher/assignExercise',
  async (
    { studentId, exerciseId }: { studentId: string; exerciseId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await parentTeacherApiService.assignExercise(
        studentId,
        { exerciseId },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign exercise');
    }
  },
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
  },
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
    { rejectWithValue },
  ) => {
    try {
      const response = await parentTeacherApiService.updateStudent(
        data.studentId,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          targetGradeLevel: data.targetGradeLevel,
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update student');
    }
  },
);
