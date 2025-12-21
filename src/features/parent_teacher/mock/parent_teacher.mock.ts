import { Student, UserRole, ReadingLevel } from '@shared/types/api.types';
import { StudentDetail } from '@features/parent_teacher/redux/slices/parent_teacher.slice';
import { Exercise } from '@features/student/redux/slices/student.slice';

// Mock students - using let to allow mutations
export let mockStudents: Student[] = [
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
    parentId: 'parent-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'student-2',
    email: 'student2@test.com',
    firstName: 'Emma',
    lastName: 'Student',
    role: UserRole.STUDENT,
    readingLevel: ReadingLevel.KINDERGARTEN,
    targetGradeLevel: ReadingLevel.KINDERGARTEN,
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    parentId: 'parent-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export let mockStudentDetails: Record<string, StudentDetail> = {
  'student-1': {
    id: 'student-1',
    email: 'student@test.com',
    firstName: 'Alex',
    lastName: 'Student',
    role: UserRole.STUDENT,
    readingLevel: ReadingLevel.GRADE_1,
    targetGradeLevel: ReadingLevel.GRADE_1,
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    parentId: 'parent-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: {
      studentId: 'student-1',
      currentLevel: ReadingLevel.GRADE_1,
      exercisesCompleted: 5,
      totalExercises: 10,
      averageScore: 85,
      lastActivityAt: new Date().toISOString(),
    },
    recentAssessments: [
      {
        id: 'assessment-1',
        studentId: 'student-1',
        readingLevel: ReadingLevel.GRADE_1,
        score: 85,
        feedback: 'Great progress!',
        completedAt: new Date().toISOString(),
      },
    ],
    recentExerciseAttempts: [
      {
        id: 'attempt-1',
        exerciseId: 'exercise-1',
        studentId: 'student-1',
        answers: { 'q1': 'answer1', 'q2': 'answer2' },
        score: 90,
        feedback: 'Excellent work!',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(),
        timeSpentSeconds: 300, // 5 minutes
      },
      {
        id: 'attempt-2',
        exerciseId: 'exercise-2',
        studentId: 'student-1',
        answers: { 'q1': 'answer1', 'q2': 'answer2', 'q3': 'answer3' },
        score: 80,
        feedback: 'Great job!',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 7 * 60 * 1000).toISOString(),
        timeSpentSeconds: 420, // 7 minutes
      },
      {
        id: 'attempt-3',
        exerciseId: 'exercise-3',
        studentId: 'student-1',
        answers: { 'q1': 'answer1' },
        score: 85,
        feedback: 'Good work!',
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 - 4 * 60 * 1000).toISOString(),
        timeSpentSeconds: 240, // 4 minutes
      },
    ],
  },
  'student-2': {
    id: 'student-2',
    email: 'student2@test.com',
    firstName: 'Emma',
    lastName: 'Student',
    role: UserRole.STUDENT,
    readingLevel: ReadingLevel.KINDERGARTEN,
    targetGradeLevel: ReadingLevel.KINDERGARTEN,
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    parentId: 'parent-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: {
      studentId: 'student-2',
      currentLevel: ReadingLevel.KINDERGARTEN,
      exercisesCompleted: 3,
      totalExercises: 8,
      averageScore: 78,
      lastActivityAt: new Date().toISOString(),
    },
    recentAssessments: [
      {
        id: 'assessment-2',
        studentId: 'student-2',
        readingLevel: ReadingLevel.KINDERGARTEN,
        score: 78,
        feedback: 'Keep up the good work!',
        completedAt: new Date().toISOString(),
      },
    ],
    recentExerciseAttempts: [
      {
        id: 'attempt-4',
        exerciseId: 'exercise-2',
        studentId: 'student-2',
        answers: { 'q1': 'answer1' },
        score: 75,
        feedback: 'Good effort!',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000).toISOString(),
        timeSpentSeconds: 600, // 10 minutes
      },
      {
        id: 'attempt-5',
        exerciseId: 'exercise-1',
        studentId: 'student-2',
        answers: { 'q1': 'answer1', 'q2': 'answer2' },
        score: 80,
        feedback: 'Excellent work!',
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 - 6 * 60 * 1000).toISOString(),
        timeSpentSeconds: 360, // 6 minutes
      },
    ],
  },
};

// Mock available exercises
export const mockAvailableExercises: Exercise[] = [
  {
    id: 'exercise-1',
    title: 'Reading Comprehension: The Lost Kitten',
    description: 'Read the story and answer questions about it.',
    readingLevel: ReadingLevel.GRADE_1,
    content: 'Story content...',
    questions: [],
    isCompleted: false,
  },
  {
    id: 'exercise-2',
    title: 'Phonics Practice: Letter Sounds',
    description: 'Practice letter sounds and word formation.',
    readingLevel: ReadingLevel.KINDERGARTEN,
    content: 'Phonics content...',
    questions: [],
    isCompleted: false,
  },
];
