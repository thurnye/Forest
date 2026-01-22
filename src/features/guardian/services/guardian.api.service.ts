import { apiClient } from '@shared/services/apiClient.service';
import { ApiResponse, Student, ReadingLevel } from '@shared/types/api.types';
import { Exercise, Goal } from '@features/student/redux/slices/student.slice';
import { StudentDetail } from '../types/guardian.types';

// Request DTOs matching backend
export interface RegisterStudentRequest {
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
  dateOfBirth?: string;
  grade?: string;
  targetGradeLevel?: string;
  diagnosticEnabled?: boolean;
}

export interface LinkStudentRequest {
  studentEmail: string;
}

export interface CreateAssignmentRequest {
  exerciseId: string;
  dueDate?: string;
}

export interface CreateGoalRequest {
  studentId: string;
  title: string;
  description?: string;
  type: 'exercises' | 'time' | 'streak' | 'score' | 'level';
  targetValue: number;
  unit: string;
  deadline: string;
}

export interface UpdateDiagnosticRequest {
  enabled: boolean;
}

// Backend response types
interface BackendStudent {
  _id: string;
  guardianId?: string;
  email?: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
  dateOfBirth?: string;
  grade?: string;
  readingLevel?: string;
  targetGradeLevel?: string;
  hasCompletedDiagnostic?: boolean;
  diagnosticEnabled?: boolean;
  isActive?: boolean;
  createdAt?: string;
  progress?: {
    currentLevel?: string;
    exercisesCompleted?: number;
    averageScore?: number;
    streakDays?: number;
    lastActivityAt?: string;
  };
}

interface BackendStudentDetail extends BackendStudent {
  recentAssessments?: Array<{
    _id: string;
    type: string;
    status: string;
    overallScore?: number;
    determinedLevel?: string;
    completedAt?: string;
  }>;
  recentExerciseAttempts?: Array<{
    _id: string;
    exerciseId: string;
    score?: number;
    percentage?: number;
    status: string;
    completedAt?: string;
    timeSpent?: number;
    exerciseTitle?: string;
    exerciseReadingLevel?: string;
  }>;
}

interface BackendExercise {
  _id: string;
  title: string;
  description: string;
  type: string;
  readingLevel: string;
  skillStrand: string;
  content?: string;
  questions: Array<{
    questionId: string;
    questionText: string;
    questionType: string;
    options?: string[];
    points: number;
  }>;
  totalPoints: number;
  estimatedTime: number;
  difficulty: string;
  tags: string[];
  isActive: boolean;
}

interface BackendGoal {
  _id: string;
  studentId: string;
  title: string;
  description?: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: string;
  deadline: string;
  createdBy?: string;
  createdAt: string;
}

// Transform functions
function transformStudent(backend: BackendStudent): Student {
  return {
    id: backend._id,
    email: backend.email || '',
    username: backend.username || '',
    firstName: backend.firstName,
    lastName: backend.lastName,
    role: 'STUDENT' as any,
    readingLevel: backend.readingLevel as ReadingLevel,
    guardianId: backend.guardianId,
    targetGradeLevel: backend.targetGradeLevel as ReadingLevel,
    hasCompletedDiagnostic: backend.hasCompletedDiagnostic || false,
    diagnosticEnabled: backend.diagnosticEnabled || false,
    createdAt: backend.createdAt || new Date().toISOString(),
    updatedAt: backend.createdAt || new Date().toISOString(),
  };
}

function transformStudentDetail(backend: BackendStudentDetail): StudentDetail {
  const student = transformStudent(backend);

  return {
    ...student,
    progress: {
      studentId: backend._id,
      currentLevel: (backend.progress?.currentLevel || 'pre-k') as ReadingLevel,
      exercisesCompleted: backend.progress?.exercisesCompleted || 0,
      totalExercises: 0,
      averageScore: backend.progress?.averageScore || 0,
      lastActivityAt: backend.progress?.lastActivityAt || '',
    },
    recentAssessments: (backend.recentAssessments || []).map((a) => ({
      id: a._id,
      studentId: backend._id,
      readingLevel: (a.determinedLevel || 'pre-k') as ReadingLevel,
      score: a.overallScore || 0,
      feedback: '',
      completedAt: a.completedAt || '',
    })),
    recentExerciseAttempts: (backend.recentExerciseAttempts || []).map((a) => ({
      id: a._id,
      exerciseId: a.exerciseId,
      studentId: backend._id,
      answers: {},
      score: a.score || a.percentage || 0,
      feedback: '',
      completedAt: a.completedAt || '',
      startedAt: '',
      timeSpentSeconds: a.timeSpent || 0,
    })),
  };
}

function transformExercise(backend: BackendExercise): Exercise {
  return {
    id: backend._id,
    title: backend.title,
    description: backend.description,
    readingLevel: backend.readingLevel as ReadingLevel,
    content: backend.content || '',
    questions: backend.questions.map((q) => ({
      id: q.questionId,
      text: q.questionText,
      type: q.questionType === 'multiple-choice' ? 'multiple-choice' : 'text',
      options: q.options,
    })),
    isCompleted: false,
  };
}

function transformGoal(backend: BackendGoal): Goal {
  return {
    id: backend._id,
    studentId: backend.studentId,
    title: backend.title,
    description: backend.description || '',
    targetValue: backend.targetValue,
    currentValue: backend.currentValue,
    unit: backend.unit as 'exercises' | 'score' | 'reading-time',
    deadline: backend.deadline,
    createdAt: backend.createdAt,
    createdBy: backend.createdBy || '',
    isCompleted: backend.status === 'completed',
  };
}

class GuardianApiService {
  /**
   * GET /guardian/students
   * Get all students linked to this guardian
   */
  async getStudents(): Promise<ApiResponse<Student[]>> {
    const response = await apiClient.get<BackendStudent[]>('/guardian/students');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformStudent),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * GET /guardian/students/:studentId
   * Get detailed information about a specific student
   */
  async getStudentDetail(studentId: string): Promise<ApiResponse<StudentDetail>> {
    const response = await apiClient.get<BackendStudentDetail>(`/guardian/students/${studentId}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: transformStudentDetail(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * POST /guardian/students/register
   * Register a new student via auth-service
   */
  async registerStudent(data: RegisterStudentRequest): Promise<ApiResponse<Student>> {
    const response = await apiClient.post<{ id: string; firstName: string; lastName: string; username: string }>(
      '/guardian/students/register',
      data
    );

    if (response.success && response.data) {
      // Return a minimal student object - full details can be fetched separately
      const student: Student = {
        id: response.data.id,
        email: '',
        username: response.data.username,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: 'STUDENT' as any,
        hasCompletedDiagnostic: false,
        diagnosticEnabled: data.diagnosticEnabled || true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: student,
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * POST /guardian/students/link
   * Link an existing student by email
   */
  async linkStudent(data: LinkStudentRequest): Promise<ApiResponse<Student>> {
    const response = await apiClient.post<BackendStudent>('/guardian/students/link', data);

    if (response.success && response.data) {
      return {
        success: true,
        data: transformStudent(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * DELETE /guardian/students/:studentId
   * Unlink a student from guardian
   */
  async unlinkStudent(studentId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/guardian/students/${studentId}`);
    return response;
  }

  /**
   * GET /guardian/exercises
   * Get all available exercises
   */
  async getAvailableExercises(params?: {
    readingLevel?: string;
    skillStrand?: string;
    type?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<Exercise[]>> {
    const queryParams = new URLSearchParams();
    if (params?.readingLevel) queryParams.append('readingLevel', params.readingLevel);
    if (params?.skillStrand) queryParams.append('skillStrand', params.skillStrand);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const url = `/guardian/exercises${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<BackendExercise[]>(url);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformExercise),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * POST /guardian/students/:studentId/assignments
   * Assign an exercise to a student
   */
  async assignExercise(studentId: string, data: CreateAssignmentRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(`/guardian/students/${studentId}/assignments`, data);
    return response;
  }

  /**
   * POST /guardian/goals
   * Create a goal for a student
   */
  async setGoal(data: CreateGoalRequest): Promise<ApiResponse<Goal>> {
    const response = await apiClient.post<BackendGoal>('/guardian/goals', data);

    if (response.success && response.data) {
      return {
        success: true,
        data: transformGoal(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * GET /guardian/students/:studentId/goals
   * Get goals for a student
   */
  async getStudentGoals(studentId: string, params?: {
    status?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<Goal[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const url = `/guardian/students/${studentId}/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<BackendGoal[]>(url);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformGoal),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * PATCH /guardian/students/:studentId/diagnostic
   * Toggle diagnostic for a student
   */
  async toggleDiagnostic(studentId: string, enabled: boolean): Promise<ApiResponse<void>> {
    const response = await apiClient.patch<void>(`/guardian/students/${studentId}/diagnostic`, { enabled });
    return response;
  }

  /**
   * Update student information (not implemented in backend yet)
   * This would need a PATCH /guardian/students/:studentId endpoint
   */
  async updateStudent(
    _studentId: string,
    _data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      targetGradeLevel?: ReadingLevel;
    }
  ): Promise<ApiResponse<Student>> {
    // TODO: Backend endpoint not yet implemented for updating student via guardian
    // For now, return error
    return {
      success: false,
      data: null,
      message: 'Update student endpoint not yet implemented',
    };
  }
}

export const guardianApiService = new GuardianApiService();

// Legacy export name for backward compatibility
export const parentTeacherApiService = guardianApiService;
