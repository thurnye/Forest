import { ApiResponse } from '@shared/types/api.types';
import { ReadingLevel } from '@shared/types/api.types';
import {
  Assessment,
  Exercise,
  ExerciseAttempt,
  StudentProgress,
  Goal,
} from '@features/student/redux/slices/student.slice';
import { mockAssessments, mockExercises, mockProgress, mockGoals } from '@features/student/mock/student.mock';

class StudentApiService {
  /**
   * Submit reading assessment - using mock data
   */
  async submitAssessment(_answers: Record<string, string>): Promise<ApiResponse<Assessment>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Calculate score (mock logic)
    const score = Math.floor(Math.random() * 30) + 70; // 70-100

    const assessment: Assessment = {
      id: `assessment-${Date.now()}`,
      studentId: 'student-1',
      readingLevel: ReadingLevel.GRADE_1,
      score,
      feedback: `You scored ${score}%. Keep up the great work!`,
      completedAt: new Date().toISOString(),
    };

    mockAssessments.push(assessment);

    return {
      success: true,
      data: assessment,
    };
  }

  /**
   * Get all exercises for the student - using mock data
   */
  async getExercises(): Promise<ApiResponse<Exercise[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: mockExercises,
    };
  }

  /**
   * Get a specific exercise by ID - using mock data
   */
  async getExerciseById(exerciseId: string): Promise<ApiResponse<Exercise>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const exercise = mockExercises.find((ex) => ex.id === exerciseId);

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    return {
      success: true,
      data: exercise,
    };
  }

  /**
   * Submit exercise answers - using mock data
   */
  async submitExercise(
    exerciseId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<ApiResponse<ExerciseAttempt>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const exercise = mockExercises.find((ex) => ex.id === exerciseId);

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // Calculate score
    let correctAnswers = 0;
    exercise.questions.forEach((q) => {
      if (q.correctAnswer && answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / exercise.questions.length) * 100);
    const completedAt = new Date().toISOString();
    const startedAt = new Date(Date.now() - timeSpentSeconds * 1000).toISOString();

    const attempt: ExerciseAttempt = {
      id: `attempt-${Date.now()}`,
      exerciseId: exerciseId,
      studentId: 'student-1',
      answers: answers,
      score,
      feedback: score >= 70 ? 'Excellent work!' : 'Keep practicing!',
      completedAt,
      startedAt,
      timeSpentSeconds,
    };

    // Mark exercise as completed
    exercise.isCompleted = true;

    return {
      success: true,
      data: attempt,
    };
  }

  /**
   * Get student progress - using mock data
   */
  async getProgress(): Promise<ApiResponse<StudentProgress>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: mockProgress,
    };
  }

  /**
   * Get assessment history - using mock data
   */
  async getAssessmentHistory(): Promise<ApiResponse<Assessment[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: mockAssessments,
    };
  }

  /**
   * Get student goals - using mock data
   */
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: mockGoals,
    };
  }
}

export const studentApiService = new StudentApiService();
