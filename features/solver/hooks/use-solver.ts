import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FetchParams,
  SolveParams,
  SolveMultipleParams,
  InsertParams,
  DeleteParams,
  ProcessSolutionParams,
  SolverJob,
} from '@/types/solver';
import { toast } from 'sonner';
import { useCase } from '@/components/case-provider';
import { PythonConfigValidation } from '@/lib/config/app-config';

/**
 * React Query hooks for solver configuration validation and command execution.
 * 
 * For job history queries, see use-jobs.ts.
 */

/**
 * Hook to validate Python solver configuration.
 * Checks if Python CLI is properly configured and can be executed.
 * 
 * @returns React Query result with validation status and execution test results
 */
export function useValidateConfig() {
  return useQuery({
    queryKey: ['solver', 'validate-config'],
    queryFn: async (): Promise<
      PythonConfigValidation & {
        executionTest: {
          success: boolean;
          message: string;
          details?: string;
        } | null;
      }
    > => {
      const response = await fetch('/api/solver/validate-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },
    staleTime: 30000, // 30 seconds
    retry: false,
  });
}

/**
 * Hook to execute fetch command.
 */
export function useFetch() {
  const { currentCaseId } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: FetchParams): Promise<{ job: SolverJob }> => {
      const response = await fetch('/api/solver/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch from DB');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      
      if (data.job.status === 'completed') {
        toast.success('Daten erfolgreich von der Datenbank abgerufen');
      } else {
        toast.error('Fehler beim Abrufen der Daten', {
          description: data.job.error,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      toast.error('Fehler beim Ausführen des Fetch-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute solve command.
 */
export function useSolve() {
  const { currentCaseId } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SolveParams): Promise<{ job: SolverJob }> => {
      const response = await fetch('/api/solver/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to solve scheduling problem');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      
      if (data.job.status === 'completed') {
        toast.success('Dienstplan erfolgreich erstellt');
      } else {
        toast.error('Fehler beim Erstellen des Dienstplans', {
          description: data.job.error,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      toast.error('Fehler beim Ausführen des Solve-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute solve-multiple command.
 */
export function useSolveMultiple() {
  const { currentCaseId } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SolveMultipleParams): Promise<{
      job: SolverJob;
      scheduleInfo: {
        solutionsGenerated: number;
        scheduleFiles: string[];
      };
    }> => {
      const response = await fetch('/api/solver/solve-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to solve scheduling problem (multiple)'
        );
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      
      if (data.job.status === 'completed') {
        toast.success(
          `${data.scheduleInfo.solutionsGenerated} Dienstpläne erfolgreich erstellt`,
          {
            description: 'Die Lösungen können nun importiert werden',
          }
        );
      } else {
        toast.error('Fehler beim Erstellen mehrerer Dienstpläne', {
          description: data.job.error,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      toast.error('Fehler beim Ausführen des Solve-Multiple-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute insert command.
 */
export function useInsert() {
  const { currentCaseId } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: InsertParams): Promise<{ job: SolverJob }> => {
      const response = await fetch('/api/solver/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to insert to DB');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      
      if (data.job.status === 'completed') {
        toast.success('Daten erfolgreich in die Datenbank eingefügt');
      } else {
        toast.error('Fehler beim Einfügen der Daten', {
          description: data.job.error,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      toast.error('Fehler beim Ausführen des Insert-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute delete command.
 */
export function useDelete() {
  const { currentCaseId } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: DeleteParams): Promise<{ job: SolverJob }> => {
      const response = await fetch('/api/solver/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete from DB');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      
      if (data.job.status === 'completed') {
        toast.success('Daten erfolgreich aus der Datenbank gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Daten', {
          description: data.job.error,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      toast.error('Fehler beim Ausführen des Delete-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute process-solution command.
 */
export function useProcessSolution() {
  const { currentCaseId } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ProcessSolutionParams): Promise<{ job: SolverJob }> => {
      const response = await fetch('/api/solver/process-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process solution');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      
      if (data.job.status === 'completed') {
        toast.success('Lösung erfolgreich verarbeitet');
      } else {
        toast.error('Fehler beim Verarbeiten der Lösung', {
          description: data.job.error,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs'] });
      toast.error('Fehler beim Ausführen des Process-Solution-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}
