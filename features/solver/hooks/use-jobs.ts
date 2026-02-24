import { useQuery } from '@tanstack/react-query';
import { SolverJob } from '@/types/solver';
import { useCase } from '@/components/case-provider';
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
 * @returns React Query result with jobs array
 */
export function useJobHistory() {
  const { currentCase } = useCase();

  return useQuery({
    queryKey: ['solver', 'jobs', currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<{ jobs: SolverJob[] }> => {
      if (!currentCase) throw new Error('No case selected');
      return await getJobs(currentCase.caseId, currentCase.monthYear);
    },
    enabled: !!currentCase,
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
  const { currentCase } = useCase();

  return useQuery({
    queryKey: ['solver', 'jobs', jobId, currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<{ job: SolverJob }> => {
      if (!jobId) throw new Error('No job ID provided');
      if (!currentCase) throw new Error('No case selected');
      return await getJob(currentCase.caseId, currentCase.monthYear, jobId);
    },
    enabled: !!jobId,
    staleTime: 5000,
  });
}
