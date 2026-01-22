import { DiagnosticResult } from '@shared/types/api.types';

/**
 * In-memory store for diagnostic status overrides
 * Used by the mock diagnostic service to track student diagnostic state
 */
export const diagnosticOverrides = new Map<
  string,
  {
    diagnosticEnabled: boolean;
    hasCompletedDiagnostic: boolean;
  }
>();

/**
 * In-memory store for diagnostic results
 * Used by the mock diagnostic service to store completed diagnostic results
 */
export const diagnosticResults = new Map<string, DiagnosticResult>();
