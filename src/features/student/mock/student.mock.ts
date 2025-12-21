import { ReadingLevel } from '@shared/types/api.types';
import {
  Assessment,
  Exercise,
  StudentProgress,
  Question,
  Goal,
} from '@features/student/redux/slices/student.slice';

// Mock data
export const mockAssessments: Assessment[] = [
  {
    id: 'assessment-1',
    studentId: 'student-1',
    readingLevel: ReadingLevel.GRADE_1,
    score: 75,
    feedback: 'Great job! You are reading at a first-grade level.',
    completedAt: new Date().toISOString(),
  },
];

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the main character\'s name?',
    type: 'multiple-choice',
    options: ['Tom', 'Sarah', 'Mike', 'Emma'],
    correctAnswer: 'Sarah',
  },
  {
    id: 'q2',
    text: 'Where does the story take place?',
    type: 'multiple-choice',
    options: ['School', 'Park', 'Home', 'Library'],
    correctAnswer: 'Park',
  },
  {
    id: 'q3',
    text: 'What did Sarah find?',
    type: 'text',
  },
];

export const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    title: 'Reading Comprehension: The Lost Kitten',
    description: 'Read the story and answer questions about it.',
    readingLevel: ReadingLevel.GRADE_1,
    content:
      'Sarah was walking in the park when she heard a soft meow. She looked around and saw a tiny kitten hiding under a bush. The kitten looked scared and hungry. Sarah gently picked up the kitten and took it home.',
    questions: mockQuestions,
    isCompleted: false,
  },
  {
    id: 'exercise-2',
    title: 'Phonics Practice: Letter Sounds',
    description: 'Practice letter sounds and word formation.',
    readingLevel: ReadingLevel.KINDERGARTEN,
    content: 'Match the pictures with the correct beginning sounds.',
    questions: [
      {
        id: 'q1',
        text: 'Which word starts with "B"?',
        type: 'multiple-choice',
        options: ['Cat', 'Ball', 'Dog', 'Tree'],
        correctAnswer: 'Ball',
      },
    ],
    isCompleted: false,
  },
  {
    id: 'exercise-3',
    title: 'Story Sequencing',
    description: 'Put the events in the correct order.',
    readingLevel: ReadingLevel.GRADE_2,
    content: 'Arrange these events in the order they happened.',
    questions: [
      {
        id: 'q1',
        text: 'What happened first?',
        type: 'multiple-choice',
        options: [
          'They went home',
          'They had breakfast',
          'They woke up',
          'They played outside',
        ],
        correctAnswer: 'They woke up',
      },
    ],
    isCompleted: true,
  },
];

export const mockProgress: StudentProgress = {
  studentId: 'student-1',
  currentLevel: ReadingLevel.GRADE_1,
  exercisesCompleted: 1,
  totalExercises: 3,
  averageScore: 85,
  lastActivityAt: new Date().toISOString(),
};

export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    studentId: 'student-1',
    title: 'Complete 5 Reading Exercises',
    description: 'Finish 5 reading comprehension exercises this week',
    targetValue: 5,
    currentValue: 1,
    unit: 'exercises',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    createdAt: new Date().toISOString(),
    createdBy: 'parent-1',
    isCompleted: false,
  },
  {
    id: 'goal-2',
    studentId: 'student-1',
    title: 'Achieve 90% Average Score',
    description: 'Maintain an average score of 90% or higher',
    targetValue: 90,
    currentValue: 85,
    unit: 'score',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month from now
    createdAt: new Date().toISOString(),
    createdBy: 'parent-1',
    isCompleted: false,
  },
];
