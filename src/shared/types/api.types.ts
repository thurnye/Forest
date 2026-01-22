/**
 * Shared API types used across the application
 * Aligned with backend response format
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  data: null;
  errors: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Array<{ code: string; message: string; field?: string }>;
}

// User roles - matches backend role values
export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  GUARDIAN = 'GUARDIAN',
}

export enum ReadingLevel {
  PRE_K = 'pre-k',
  KINDERGARTEN = 'kindergarten',
  GRADE_1 = 'grade-1',
  GRADE_2 = 'grade-2',
  GRADE_3 = 'grade-3',
  GRADE_4 = 'grade-4',
  GRADE_5 = 'grade-5',
}

export enum SkillLevel {
  BELOW_GRADE = 'below-grade',
  ON_GRADE = 'on-grade',
  ABOVE_GRADE = 'above-grade',
}

export enum SkillStrand {
  PHONOLOGICAL_AWARENESS = 'phonological-awareness',
  PHONICS = 'phonics',
  VOCABULARY = 'vocabulary',
  COMPREHENSION = 'comprehension',
  FLUENCY = 'fluency',
}

export interface StrandResult {
  strand: SkillStrand;
  level: SkillLevel;
  accuracy: number; // 0-100
  averageResponseTime: number; // in milliseconds
  placementLevel: ReadingLevel;
}

export interface DiagnosticResult {
  id: string;
  studentId: string;
  completedAt: string;
  overallPlacement: ReadingLevel;
  strandResults: StrandResult[];
  recommendedStartingLevel: ReadingLevel;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  username: string;
  readingLevel?: ReadingLevel;
  guardianId?: string;
  teacherId?: string;
  targetGradeLevel?: ReadingLevel; // Grade level set by parent/teacher
  hasCompletedDiagnostic: boolean;
  diagnosticEnabled: boolean;
  diagnosticResult?: DiagnosticResult;
}

export interface Parent extends User {
  role: UserRole.PARENT;
  students: string[]; // Array of student IDs
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  students: string[]; // Array of student IDs
}

// Error Codes matching backend
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}

// Custom API Error Class
export class ApiClientError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    public field?: string,
    public errors?: ApiError[]
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}
