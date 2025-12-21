import {
  DiagnosticResult,
  StrandResult,
  SkillStrand,
  SkillLevel,
  ReadingLevel,
  ApiResponse
} from '@shared/types/api.types';
import { diagnosticOverrides, diagnosticResults } from '@features/parent_teacher/services/parent_teacher.api.service';

/**
 * Diagnostic Service - Mock implementation
 * Simulates an adaptive learning engine that evaluates student performance
 */
class DiagnosticService {
  /**
   * Simulate automaticity warm-up tasks
   * These are quick-response tasks measuring basic reading-related automaticity
   */
  async runWarmupTasks(_studentId: string, _targetGrade: ReadingLevel): Promise<ApiResponse<{
    completed: boolean;
    warmupScore: number;
  }>> {
    // Simulate API delay for warm-up activities
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock warm-up result (random score between 60-95)
    const warmupScore = Math.floor(Math.random() * 35) + 60;

    return {
      success: true,
      data: {
        completed: true,
        warmupScore,
      },
    };
  }

  /**
   * Simulate adaptive placement activities across multiple skill strands
   * Each strand is evaluated independently with accuracy, response time, and error patterns
   */
  async runPlacementActivities(
    studentId: string,
    targetGrade: ReadingLevel,
    warmupScore: number
  ): Promise<ApiResponse<DiagnosticResult>> {
    // Simulate API delay for placement activities (longer process)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate strand results based on target grade and warm-up performance
    const strandResults: StrandResult[] = this.generateStrandResults(targetGrade, warmupScore);

    // Calculate overall placement based on strand results
    const overallPlacement = this.calculateOverallPlacement(strandResults, targetGrade);
    const recommendedStartingLevel = this.calculateRecommendedLevel(strandResults, overallPlacement);

    const diagnosticResult: DiagnosticResult = {
      id: `diagnostic-${Date.now()}`,
      studentId,
      completedAt: new Date().toISOString(),
      overallPlacement,
      strandResults,
      recommendedStartingLevel,
    };

    return {
      success: true,
      data: diagnosticResult,
    };
  }

  /**
   * Generate results for each skill strand
   * Uses adaptive branching: Direct Instruction → Guided Practice → Independent Practice
   */
  private generateStrandResults(targetGrade: ReadingLevel, warmupScore: number): StrandResult[] {
    const strands = [
      SkillStrand.PHONOLOGICAL_AWARENESS,
      SkillStrand.PHONICS,
      SkillStrand.VOCABULARY,
      SkillStrand.COMPREHENSION,
      SkillStrand.FLUENCY,
    ];

    return strands.map(strand => {
      // Simulate variation in performance across strands
      const baseAccuracy = warmupScore;
      const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
      const accuracy = Math.min(100, Math.max(40, baseAccuracy + variation));

      // Response time varies by strand (some are naturally faster)
      const baseResponseTime = this.getBaseResponseTime(strand);
      const timeVariation = Math.floor(Math.random() * 1000);
      const averageResponseTime = baseResponseTime + timeVariation;

      // Determine skill level based on accuracy
      const level = this.determineSkillLevel(accuracy);

      // Determine placement level for this strand
      const placementLevel = this.determinePlacementLevel(accuracy, targetGrade);

      return {
        strand,
        level,
        accuracy,
        averageResponseTime,
        placementLevel,
      };
    });
  }

  /**
   * Get base response time for each strand (in milliseconds)
   */
  private getBaseResponseTime(strand: SkillStrand): number {
    const baseTimes: Record<SkillStrand, number> = {
      [SkillStrand.PHONOLOGICAL_AWARENESS]: 1500,
      [SkillStrand.PHONICS]: 2000,
      [SkillStrand.VOCABULARY]: 2500,
      [SkillStrand.COMPREHENSION]: 4000,
      [SkillStrand.FLUENCY]: 3000,
    };
    return baseTimes[strand];
  }

  /**
   * Determine skill level based on accuracy percentage
   */
  private determineSkillLevel(accuracy: number): SkillLevel {
    if (accuracy >= 80) return SkillLevel.ABOVE_GRADE;
    if (accuracy >= 60) return SkillLevel.ON_GRADE;
    return SkillLevel.BELOW_GRADE;
  }

  /**
   * Determine placement level for a strand based on accuracy and target grade
   */
  private determinePlacementLevel(accuracy: number, targetGrade: ReadingLevel): ReadingLevel {
    const gradeLevels = [
      ReadingLevel.PRE_K,
      ReadingLevel.KINDERGARTEN,
      ReadingLevel.GRADE_1,
      ReadingLevel.GRADE_2,
      ReadingLevel.GRADE_3,
      ReadingLevel.GRADE_4,
      ReadingLevel.GRADE_5,
    ];

    const targetIndex = gradeLevels.indexOf(targetGrade);

    // Adjust placement based on accuracy
    if (accuracy >= 85) {
      // Above grade level - move up
      return gradeLevels[Math.min(targetIndex + 1, gradeLevels.length - 1)];
    } else if (accuracy >= 60) {
      // On grade level
      return targetGrade;
    } else {
      // Below grade level - move down
      return gradeLevels[Math.max(targetIndex - 1, 0)];
    }
  }

  /**
   * Calculate overall placement based on all strand results
   * Uses the median placement across all strands
   */
  private calculateOverallPlacement(strandResults: StrandResult[], _targetGrade: ReadingLevel): ReadingLevel {
    const gradeLevels = [
      ReadingLevel.PRE_K,
      ReadingLevel.KINDERGARTEN,
      ReadingLevel.GRADE_1,
      ReadingLevel.GRADE_2,
      ReadingLevel.GRADE_3,
      ReadingLevel.GRADE_4,
      ReadingLevel.GRADE_5,
    ];

    // Get all placement levels as indices
    const placementIndices = strandResults.map(result =>
      gradeLevels.indexOf(result.placementLevel)
    );

    // Calculate median
    placementIndices.sort((a, b) => a - b);
    const medianIndex = placementIndices[Math.floor(placementIndices.length / 2)];

    return gradeLevels[medianIndex];
  }

  /**
   * Calculate recommended starting level
   * This is typically the same as overall placement but can be adjusted
   * based on specific patterns in the results
   */
  private calculateRecommendedLevel(strandResults: StrandResult[], overallPlacement: ReadingLevel): ReadingLevel {
    // Count how many strands are below grade
    const belowGradeCount = strandResults.filter(r => r.level === SkillLevel.BELOW_GRADE).length;

    const gradeLevels = [
      ReadingLevel.PRE_K,
      ReadingLevel.KINDERGARTEN,
      ReadingLevel.GRADE_1,
      ReadingLevel.GRADE_2,
      ReadingLevel.GRADE_3,
      ReadingLevel.GRADE_4,
      ReadingLevel.GRADE_5,
    ];

    const overallIndex = gradeLevels.indexOf(overallPlacement);

    // If most strands are below grade, recommend one level down for more support
    if (belowGradeCount >= 3) {
      return gradeLevels[Math.max(overallIndex - 1, 0)];
    }

    return overallPlacement;
  }

  /**
   * Submit diagnostic results and update student profile
   */
  async submitDiagnosticResults(
    studentId: string,
    diagnosticResult: DiagnosticResult
  ): Promise<ApiResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Submitting diagnostic results for student:', studentId);
    console.log('Diagnostic result:', diagnosticResult);

    // Get current override or create new one
    const currentOverride = diagnosticOverrides.get(studentId);

    // Update override to mark diagnostic as completed
    diagnosticOverrides.set(studentId, {
      diagnosticEnabled: currentOverride?.diagnosticEnabled ?? true,
      hasCompletedDiagnostic: true,
    });

    // Save diagnostic result for parent/teacher to view
    diagnosticResults.set(studentId, diagnosticResult);

    console.log('Updated diagnostic override:', diagnosticOverrides.get(studentId));
    console.log('Saved diagnostic result:', diagnosticResults.get(studentId));

    return {
      success: true,
      message: 'Diagnostic results saved successfully',
    };
  }
}

export const diagnosticService = new DiagnosticService();
