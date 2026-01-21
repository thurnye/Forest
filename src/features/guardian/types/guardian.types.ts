import { Student } from "@/shared/types/api.types";
import { Assessment, StudentProgress, Exercise, ExerciseAttempt } from '@features/student/redux/slices/student.slice';


export interface StudentDetail extends Student {
  progress: StudentProgress;
  recentAssessments: Assessment[];
  recentExerciseAttempts: ExerciseAttempt[];
}

export interface ParentTeacherState {
  students: Student[];
  selectedStudent: StudentDetail | null;
  availableExercises: Exercise[];
  isLoading: boolean;
  error: string | null;
}
