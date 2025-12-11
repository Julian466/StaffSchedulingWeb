import { useQuery } from '@tanstack/react-query';
import { SolverJob } from '@/types/solver';
import { useCase } from '@/components/case-provider';

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
 * @returns React Query result with jobs array
 */
export function useJobHistory() {
  const { currentCaseId } = useCase();

  return useQuery({
    queryKey: ['solver', 'jobs', currentCaseId],
    queryFn: async (): Promise<{ jobs: SolverJob[] }> => {
      const res = await fetch('/api/solver/jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch job history');
      return await res.json();
    },
  });
}

/**
 * Hook to get a specific job by ID.
 * Useful for monitoring job status or retrieving job results.
 * 
 * @param jobId - The job ID to fetch, or null to disable the query
 * @returns React Query result with job data
 */
export function useJob(jobId: string | null) {
  const { currentCaseId } = useCase();

  return useQuery({
    queryKey: ['solver', 'jobs', jobId, currentCaseId],
    queryFn: async (): Promise<{ job: SolverJob }> => {
      const response = await fetch(`/api/solver/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Job not found');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },
    enabled: !!jobId,
    staleTime: 5000,
  });
}
