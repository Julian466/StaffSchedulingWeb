import { useQuery } from '@tanstack/react-query';
import { SolverJob } from '@/types/solver';
import { getJobs, getJob } from '@/features/solver/solver.actions';

/**
 * React Query hooks for managing solver job data.
 * Provides read-only queries for job history and individual jobs.
 * 
 * For executing solver operations (solve, fetch, insert, etc.),
 * see use-solver.ts hooks.
 */

/**
 * Hook to get job history for the current case.
 * Returns all jobs ordered by creation date (newest first).
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with jobs array
 */
export function useJobHistory(caseId: number, monthYear: string) {
  return useQuery({
    queryKey: ['solver', 'jobs', caseId, monthYear],
    queryFn: async (): Promise<{ jobs: SolverJob[] }> => {
      return await getJobs(caseId, monthYear);
    },
  });
}

/**
 * Hook to get a specific job by ID.
 * Useful for monitoring job status or retrieving job results.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @param jobId - The job ID to fetch, or null to disable the query
 * @returns React Query result with job data
 */
export function useJob(caseId: number, monthYear: string, jobId: string | null) {
  return useQuery({
    queryKey: ['solver', 'jobs', jobId, caseId, monthYear],
    queryFn: async (): Promise<{ job: SolverJob }> => {
      if (!jobId) throw new Error('No job ID provided');
      return await getJob(caseId, monthYear, jobId);
    },
    enabled: !!jobId,
    staleTime: 5000,
  });
}
