import { UserRole, ReadingLevel, Student, Parent, Teacher } from '@shared/types/api.types';

// Mock users database
export const mockUsers: (Student | Parent | Teacher)[] = [
  {
    id: 'student-1',
    email: 'student@test.com',
    firstName: 'Alex',
    lastName: 'Student',
    role: UserRole.STUDENT,
    readingLevel: ReadingLevel.GRADE_1,
    targetGradeLevel: ReadingLevel.GRADE_1,
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Student,
  {
    id: 'parent-1',
    email: 'parent@test.com',
    firstName: 'Jane',
    lastName: 'Parent',
    role: UserRole.PARENT,
    students: ['student-1', 'student-2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Parent,
  {
    id: 'teacher-1',
    email: 'teacher@test.com',
    firstName: 'John',
    lastName: 'Teacher',
    role: UserRole.TEACHER,
    students: ['student-1', 'student-2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Teacher,
];
