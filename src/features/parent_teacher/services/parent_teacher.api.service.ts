import { ApiResponse, Student, UserRole } from '@shared/types/api.types';
import { StudentDetail } from '@features/parent_teacher/redux/slices/parent_teacher.slice';
import { Exercise, Goal } from '@features/student/redux/slices/student.slice';
import {
  mockStudents,
  mockStudentDetails,
  mockAvailableExercises,
} from '@features/parent_teacher/mock/parent_teacher.mock';
import { mockGoals } from '@features/student/mock/student.mock';

import { DiagnosticResult } from '@shared/types/api.types';

// In-memory store for diagnostic status overrides
export const diagnosticOverrides = new Map<string, {
  diagnosticEnabled: boolean;
  hasCompletedDiagnostic: boolean;
}>();

// In-memory store for diagnostic results
export const diagnosticResults = new Map<string, DiagnosticResult>();

class ParentTeacherApiService {
  /**
   * Get all students linked to this parent/teacher - using mock data
   */
  async getStudents(): Promise<ApiResponse<Student[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: mockStudents,
    };
  }

  /**
   * Get detailed information about a specific student - using mock data
   */
  async getStudentDetail(studentId: string): Promise<ApiResponse<StudentDetail>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let studentDetail = mockStudentDetails[studentId];

    if (!studentDetail) {
      throw new Error('Student not found');
    }

    // Apply diagnostic overrides if they exist
    const override = diagnosticOverrides.get(studentId);
    if (override) {
      studentDetail = {
        ...studentDetail,
        diagnosticEnabled: override.diagnosticEnabled,
        hasCompletedDiagnostic: override.hasCompletedDiagnostic,
      };
    }

    // Add diagnostic result if it exists
    const diagnosticResult = diagnosticResults.get(studentId);
    if (diagnosticResult) {
      studentDetail = {
        ...studentDetail,
        diagnosticResult,
      };
    }

    return {
      success: true,
      data: studentDetail,
    };
  }

  /**
   * Link an existing student by email - using mock data
   */
  async linkStudent(data: { studentEmail: string }): Promise<ApiResponse<Student>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find student by email
    const student = mockStudents.find((s) => s.email === data.studentEmail);

    if (!student) {
      throw new Error('Student not found with this email');
    }

    return {
      success: true,
      data: student,
    };
  }

  /**
   * Create a new student account - using mock data
   */
  async createStudent(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    targetGradeLevel: import('@shared/types/api.types').ReadingLevel;
    diagnosticEnabled: boolean;
  }): Promise<ApiResponse<Student>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if student exists
    const existingStudent = mockStudents.find((s) => s.email === data.email);
    if (existingStudent) {
      throw new Error('Student with this email already exists');
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.STUDENT,
      targetGradeLevel: data.targetGradeLevel,
      hasCompletedDiagnostic: false,
      diagnosticEnabled: data.diagnosticEnabled,
      parentId: 'parent-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStudents.push(newStudent);

    return {
      success: true,
      data: newStudent,
    };
  }

  /**
   * Assign an exercise to a student - using mock data
   */
  async assignExercise(studentId: string, _exerciseId: string): Promise<ApiResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify student exists
    const student = mockStudents.find((s) => s.id === studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get all available exercises - using mock data
   */
  async getAvailableExercises(): Promise<ApiResponse<Exercise[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: mockAvailableExercises,
    };
  }

  /**
   * Unlink a student - using mock data
   */
  async unlinkStudent(studentId: string): Promise<ApiResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockStudents.findIndex((s) => s.id === studentId);
    if (index === -1) {
      throw new Error('Student not found');
    }

    mockStudents.splice(index, 1);

    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Set a goal for a student - using mock data
   */
  async setGoal(data: {
    studentId: string;
    title: string;
    description: string;
    targetValue: number;
    unit: 'exercises' | 'score' | 'reading-time';
    deadline: string;
  }): Promise<ApiResponse<Goal>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify student exists
    const student = mockStudents.find((s) => s.id === data.studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      studentId: data.studentId,
      title: data.title,
      description: data.description,
      targetValue: data.targetValue,
      currentValue: 0,
      unit: data.unit,
      deadline: data.deadline,
      createdAt: new Date().toISOString(),
      createdBy: 'parent-1', // Current parent/teacher ID
      isCompleted: false,
    };

    mockGoals.push(newGoal);

    return {
      success: true,
      data: newGoal,
    };
  }

  /**
   * Get goals for a student - using mock data
   */
  async getStudentGoals(studentId: string): Promise<ApiResponse<Goal[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const goals = mockGoals.filter((g) => g.studentId === studentId);

    return {
      success: true,
      data: goals,
    };
  }

  /**
   * Toggle diagnostic for a student - using mock data
   */
  async toggleDiagnostic(studentId: string, enabled: boolean): Promise<ApiResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const student = mockStudents.find((s) => s.id === studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    console.log('Toggling diagnostic for student:', studentId, 'to', enabled);

    // Store override in memory
    diagnosticOverrides.set(studentId, {
      diagnosticEnabled: enabled,
      hasCompletedDiagnostic: enabled ? false : (diagnosticOverrides.get(studentId)?.hasCompletedDiagnostic ?? student.hasCompletedDiagnostic),
    });

    return {
      success: true,
      message: enabled
        ? 'Diagnostic enabled. Student will be prompted on next login.'
        : 'Diagnostic disabled.',
    };
  }

  /**
   * Update student information - using mock data
   */
  async updateStudent(
    studentId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      targetGradeLevel: import('@shared/types/api.types').ReadingLevel;
    }
  ): Promise<ApiResponse<Student>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const studentIndex = mockStudents.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    // Update the student in the mock data
    const updatedStudent = {
      ...mockStudents[studentIndex],
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      targetGradeLevel: data.targetGradeLevel,
      updatedAt: new Date().toISOString(),
    };

    mockStudents.splice(studentIndex, 1, updatedStudent);

    // Also update in mockStudentDetails if exists
    if (mockStudentDetails[studentId]) {
      mockStudentDetails[studentId] = {
        ...mockStudentDetails[studentId],
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        targetGradeLevel: data.targetGradeLevel,
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: updatedStudent,
      message: 'Student information updated successfully',
    };
  }
}

export const parentTeacherApiService = new ParentTeacherApiService();
