import { apiClient } from '@shared/services/apiClient.service';
import { ApiResponse, ReadingLevel } from '@shared/types/api.types';
import {
  Assessment,
  Exercise,
  ExerciseAttempt,
  StudentProgress,
  Goal,
} from '@features/student/redux/slices/student.slice';

// Backend response types
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
    explanation?: string;
  }>;
  totalPoints: number;
  estimatedTime: number;
  difficulty: string;
  tags: string[];
  isActive: boolean;
}

interface BackendAttempt {
  _id: string;
  studentId: string;
  exerciseId: string;
  answers: Record<string, string>;
  score?: number;
  totalPoints?: number;
  percentage?: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  timeSpent?: number;
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

interface BackendProgress {
  _id: string;
  studentId: string;
  currentLevel: string;
  exercisesCompleted: number;
  totalExercises?: number;
  averageScore: number;
  streakDays?: number;
  lastActivityAt?: string;
}

interface BackendAssessment {
  _id: string;
  studentId: string;
  type: string;
  status: string;
  overallScore?: number;
  determinedLevel?: string;
  completedAt?: string;
}

// Transform functions
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
      correctAnswer: undefined, // Hidden from student
    })),
    isCompleted: false,
  };
}

function transformAttempt(backend: BackendAttempt): ExerciseAttempt {
  return {
    id: backend._id,
    exerciseId: backend.exerciseId,
    studentId: backend.studentId,
    answers: backend.answers || {},
    score: backend.percentage || backend.score || 0,
    feedback: backend.percentage && backend.percentage >= 70 ? 'Great job!' : 'Keep practicing!',
    completedAt: backend.completedAt || '',
    startedAt: backend.startedAt,
    timeSpentSeconds: backend.timeSpent || 0,
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

function transformProgress(backend: BackendProgress): StudentProgress {
  return {
    studentId: backend.studentId,
    currentLevel: backend.currentLevel as ReadingLevel,
    exercisesCompleted: backend.exercisesCompleted,
    totalExercises: backend.totalExercises || 0,
    averageScore: backend.averageScore,
    lastActivityAt: backend.lastActivityAt || '',
  };
}

function transformAssessment(backend: BackendAssessment): Assessment {
  return {
    id: backend._id,
    studentId: backend.studentId,
    readingLevel: (backend.determinedLevel || 'pre-k') as ReadingLevel,
    score: backend.overallScore || 0,
    feedback: '',
    completedAt: backend.completedAt || '',
  };
}

class StudentApiService {
  private currentStudentId: string | null = null;

  /**
   * Set the current student ID (from auth context)
   */
  setStudentId(studentId: string): void {
    this.currentStudentId = studentId;
  }

  /**
   * GET /student/exercises
   * Get exercises by reading level with optional filters
   */
  async getExercises(params?: {
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

    // readingLevel is required by the backend
    if (!params?.readingLevel) {
      queryParams.append('readingLevel', 'pre-k');
    }

    const url = `/student/exercises?${queryParams.toString()}`;
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
   * GET /student/exercises/:id
   * Get a specific exercise by ID (without answers)
   */
  async getExerciseById(exerciseId: string): Promise<ApiResponse<Exercise>> {
    const response = await apiClient.get<BackendExercise>(`/student/exercises/${exerciseId}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: transformExercise(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * POST /student/attempts
   * Start a new exercise attempt
   */
  async startAttempt(exerciseId: string): Promise<ApiResponse<ExerciseAttempt>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.post<BackendAttempt>('/student/attempts', {
      studentId,
      exerciseId,
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: transformAttempt(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * POST /student/attempts/:id/complete
   * Submit exercise answers and complete the attempt
   */
  async submitExercise(
    exerciseId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<ApiResponse<ExerciseAttempt>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    // First start an attempt
    const startResponse = await apiClient.post<BackendAttempt>('/student/attempts', {
      studentId,
      exerciseId,
    });

    if (!startResponse.success || !startResponse.data) {
      return {
        success: false,
        data: null,
        message: startResponse.message || 'Failed to start attempt',
      };
    }

    const attemptId = startResponse.data._id;

    // Then complete the attempt
    const completeResponse = await apiClient.post<BackendAttempt>(`/student/attempts/${attemptId}/complete`, {
      answers,
      timeSpent: timeSpentSeconds,
    });

    if (completeResponse.success && completeResponse.data) {
      return {
        success: true,
        data: transformAttempt(completeResponse.data),
      };
    }

    return {
      success: false,
      data: null,
      message: completeResponse.message,
    };
  }

  /**
   * GET /student/progress/:studentId
   * Get student progress
   */
  async getProgress(): Promise<ApiResponse<StudentProgress>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.get<BackendProgress>(`/student/progress/${studentId}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: transformProgress(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * GET /student/assessments/student/:studentId
   * Get assessment history for the student
   */
  async getAssessmentHistory(): Promise<ApiResponse<Assessment[]>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.get<BackendAssessment[]>(`/student/assessments/student/${studentId}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformAssessment),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * POST /student/assessments
   * Submit a reading assessment
   */
  async submitAssessment(answers: Record<string, string>): Promise<ApiResponse<Assessment>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.post<BackendAssessment>('/student/assessments', {
      studentId,
      answers,
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: transformAssessment(response.data),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * GET /student/goals/student/:studentId
   * Get goals for the student
   */
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.get<BackendGoal[]>(`/student/goals/student/${studentId}`);

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
   * GET /student/attempts/student/:studentId
   * Get attempt history for the student
   */
  async getAttemptHistory(): Promise<ApiResponse<ExerciseAttempt[]>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.get<BackendAttempt[]>(`/student/attempts/student/${studentId}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformAttempt),
      };
    }

    return {
      success: false,
      data: null,
      message: response.message,
    };
  }

  /**
   * GET /student/assignments/student/:studentId
   * Get assignments for the student
   */
  async getAssignments(): Promise<ApiResponse<any[]>> {
    const studentId = this.currentStudentId;
    if (!studentId) {
      return {
        success: false,
        data: null,
        message: 'Student ID not set',
      };
    }

    const response = await apiClient.get<any[]>(`/student/assignments/student/${studentId}`);
    return response;
  }
}

export const studentApiService = new StudentApiService();
