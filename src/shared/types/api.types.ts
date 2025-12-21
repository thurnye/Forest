/**
 * Shared API types used across the application
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
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
  readingLevel?: ReadingLevel;
  parentId?: string;
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
