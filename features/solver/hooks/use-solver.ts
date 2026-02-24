import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FetchParams,
  SolveParams,
  SolveMultipleParams,
  InsertParams,
  DeleteParams,
  SolverJob,
} from '@/src/entities/models/solver.model';
import { toast } from 'sonner';
import { PythonConfigValidation } from '@/lib/config/app-config';
import {
  validateConfig,
  solverFetch,
  solverSolve,
  solverSolveMultiple,
  solverInsert,
  solverDelete,
  importSolution,
} from '@/features/solver/solver.actions';

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
      return await validateConfig();
    },
    staleTime: 30000, // 30 seconds
    retry: false,
  });
}

/**
 * Hook to execute fetch command.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useFetch(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: FetchParams): Promise<{ job: SolverJob }> => {
      return await solverFetch(caseId, monthYear, params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });
      if (data.job.status === 'completed') {
        toast.success('Daten erfolgreich von der Datenbank abgerufen');
      } else {
        toast.error('Fehler beim Abrufen der Daten', {
          description: data.job.consoleOutput,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });
      toast.error('Fehler beim Ausführen des Fetch-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute solve command.
 * Returns mutation result with success callback that includes solve parameters
 * for potential automatic import.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useSolve(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SolveParams): Promise<{ job: SolverJob; params: SolveParams }> => {
      const data = await solverSolve(caseId, monthYear, params);
      return { ...data, params };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });

      if (data.job.status === 'completed') {
        toast.success('Dienstplan erfolgreich erstellt');
      } else {
        toast.error('Fehler beim Erstellen des Dienstplans', {
          description: data.job.consoleOutput,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });
      toast.error('Fehler beim Ausführen des Solve-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute solve-multiple command.
 * Returns mutation result with success callback that includes solve parameters
 * for potential automatic import.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useSolveMultiple(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SolveMultipleParams): Promise<{
      job: SolverJob;
      scheduleInfo: {
        solutionsGenerated: number;
        scheduleFiles: string[];
        feasibleSolutions?: number[];
      };
      params: SolveMultipleParams;
    }> => {
      const data = await solverSolveMultiple(caseId, monthYear, params);
      return { ...data, params };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });

      if (data.job.status === 'completed') {
        const successCount = data.scheduleInfo.solutionsGenerated;
        const expectedCount = 3;

        if (successCount === expectedCount) {
          toast.success(
            `${successCount} Dienstpläne erfolgreich erstellt`,
            {
              description: 'Alle Lösungen können nun importiert werden',
            }
          );
        } else if (successCount > 0) {
          toast.warning(
            `Nur ${successCount} von ${expectedCount} Dienstplänen erstellt`,
            {
              description: 'Einige Lösungen konnten nicht generiert werden (kein FEASIBLE Status)',
            }
          );
        } else {
          toast.error('Keine Dienstpläne erstellt', {
            description: 'Der Solver konnte keine FEASIBLE Lösungen finden',
          });
        }
      } else {
        toast.error('Fehler beim Erstellen mehrerer Dienstpläne', {
          description: data.job.consoleOutput,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });
      toast.error('Fehler beim Ausführen des Solve-Multiple-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute insert command.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useInsert(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: InsertParams): Promise<{ job: SolverJob }> => {
      return await solverInsert(caseId, monthYear, params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });

      if (data.job.status === 'completed') {
        toast.success('Daten erfolgreich in die Datenbank eingefügt');
      } else {
        toast.error('Fehler beim Einfügen der Daten', {
          description: data.job.consoleOutput,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });
      toast.error('Fehler beim Ausführen des Insert-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to execute delete command.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useDelete(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: DeleteParams): Promise<{ job: SolverJob }> => {
      return await solverDelete(caseId, monthYear, params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });

      if (data.job.status === 'completed') {
        toast.success('Daten erfolgreich aus der Datenbank gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Daten', {
          description: data.job.consoleOutput,
        });
      }
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['solver', 'jobs', caseId, monthYear] });
      toast.error('Fehler beim Ausführen des Delete-Befehls', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

/**
 * Hook to import a processed solution file.
 * Reads the solution from StaffScheduling/processed_solutions and saves it as a schedule.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useImportSolution(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      caseId: number;
      start: string;
      end: string;
      solutionType: string;
    }): Promise<{
      success: boolean;
      scheduleId: string;
      filename: string;
      message: string;
    }> => {
      return await importSolution(caseId, monthYear, params);
    },
    onSuccess: (data) => {
      // Invalidate schedules to refresh the list
      queryClient.invalidateQueries({ queryKey: ['schedules', caseId, monthYear] });
      queryClient.invalidateQueries({ queryKey: ['selectedSchedule', caseId, monthYear] });

      toast.success('Lösung erfolgreich importiert', {
        description: `Schedule ID: ${data.scheduleId}`,
      });
    },
    onError: (error) => {
      toast.error('Fehler beim Importieren der Lösung', {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

