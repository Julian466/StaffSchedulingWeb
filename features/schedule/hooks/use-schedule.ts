'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ScheduleSolution, ScheduleSolutionRaw, SchedulesMetadata } from '@/types/schedule';
import { useCase } from '@/components/case-provider';
import { parseSolutionFile } from '@/lib/services/schedule-parser';
import {
  getSchedulesMetadataAction,
  getSelectedScheduleAction,
  getScheduleByIdAction,
  saveScheduleAction,
  selectScheduleAction,
  deleteScheduleAction,
  updateScheduleMetadataAction,
} from '@/features/schedule/schedule.actions';

/**
 * Hook to fetch all schedules metadata for the current case.
 * 
 * @returns React Query result with schedules metadata
 */
export function useSchedulesMetadata() {
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['schedules-metadata', currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<SchedulesMetadata> => {
      if (!currentCase) throw new Error('No case selected');
      return getSchedulesMetadataAction(currentCase.caseId, currentCase.monthYear);
    },
    enabled: !!currentCase,
  });
}

/**
 * Hook to fetch the currently selected schedule solution.
 * Parses the raw solution data into a usable format with fulfilled wishes.
 * 
 * @returns React Query result with parsed schedule data
 */
export function useSchedule() {
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['schedule', 'selected', currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<ScheduleSolution | null> => {
      if (!currentCase) throw new Error('No case selected');
      const data = await getSelectedScheduleAction(currentCase.caseId, currentCase.monthYear);
      
      // Return null if no schedule exists yet
      if (!data.solution) return null;
      
      // Parse the raw solution data
      return parseSolutionFile(data.solution);
    },
    enabled: !!currentCase,
  });
}

/**
 * Hook to fetch a specific schedule solution by ID.
 * 
 * @param scheduleId - The ID of the schedule to fetch
 * @returns React Query result with parsed schedule data
 */
export function useScheduleById(scheduleId: string | null) {
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['schedule', scheduleId, currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<ScheduleSolution | null> => {
      if (!scheduleId) return null;
      if (!currentCase) throw new Error('No case selected');
      
      const data = await getScheduleByIdAction(currentCase.caseId, currentCase.monthYear, scheduleId);
      
      if (!data.solution) return null;
      
      return parseSolutionFile(data.solution);
    },
    enabled: !!scheduleId,
  });
}

/**
 * Hook to save a new schedule solution with optional description.
 * Invalidates relevant query caches on success.
 * 
 * @returns Mutation function to save schedule
 */
export function useSaveSchedule() {
  const { currentCase } = useCase();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      scheduleId: string;
      description?: string;
      solution: ScheduleSolutionRaw;
      autoSelect?: boolean;
    }) => {
      if (!currentCase) throw new Error('No case selected');
      return saveScheduleAction(
        currentCase.caseId,
        currentCase.monthYear,
        params.scheduleId,
        params.solution,
        params.description,
        params.autoSelect,
      );
    },
    onSuccess: () => {
      currentCase && queryClient.invalidateQueries({ queryKey: ['schedule', currentCase.caseId, currentCase.monthYear] });
      currentCase && queryClient.invalidateQueries({ queryKey: ['schedules-metadata', currentCase.caseId, currentCase.monthYear] });
    },
  });
}

/**
 * Hook to select a schedule as the active one.
 * Invalidates relevant query caches on success.
 * 
 * @returns Mutation function to select schedule
 */
export function useSelectSchedule() {
  const { currentCase } = useCase();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scheduleId: string) => {
      if (!currentCase) throw new Error('No case selected');
      return selectScheduleAction(currentCase.caseId, currentCase.monthYear, scheduleId);
    },
    onSuccess: () => {
      currentCase && queryClient.invalidateQueries({ queryKey: ['schedule', currentCase.caseId, currentCase.monthYear] });
      currentCase && queryClient.invalidateQueries({ queryKey: ['schedules-metadata', currentCase.caseId, currentCase.monthYear] });
    },
  });
}

/**
 * Hook to delete a specific schedule.
 * Invalidates relevant query caches on success.
 * 
 * @returns Mutation function to delete schedule
 */
export function useDeleteSchedule() {
  const { currentCase } = useCase();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scheduleId: string) => {
      if (!currentCase) throw new Error('No case selected');
      return deleteScheduleAction(currentCase.caseId, currentCase.monthYear, scheduleId);
    },
    onSuccess: () => {
      currentCase && queryClient.invalidateQueries({ queryKey: ['schedule', currentCase.caseId, currentCase.monthYear] });
      currentCase && queryClient.invalidateQueries({ queryKey: ['schedules-metadata', currentCase.caseId, currentCase.monthYear] });
    },
  });
}

/**
 * Hook to update schedule metadata (e.g., description).
 * Invalidates relevant query caches on success.
 * 
 * @returns Mutation function to update schedule
 */
export function useUpdateSchedule() {
  const { currentCase } = useCase();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { scheduleId: string; description?: string; comment?: string }) => {
      if (!currentCase) throw new Error('No case selected');
      return updateScheduleMetadataAction(
        currentCase.caseId,
        currentCase.monthYear,
        params.scheduleId,
        { description: params.description, comment: params.comment },
      );
    },
    onSuccess: () => {
       currentCase && queryClient.invalidateQueries({ queryKey: ['schedules-metadata', currentCase.caseId, currentCase.monthYear] });
    },
  });
}

/**
 * Hook to fetch multiple schedule solutions by their IDs.
 * Used for comparing multiple schedules side by side.
 * 
 * @param scheduleIds - Array of schedule IDs to fetch
 * @returns React Query result with array of parsed schedule data
 */
export function useMultipleSchedules(scheduleIds: string[]) {
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['schedules', 'multiple', scheduleIds.sort(), currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<(ScheduleSolution & { scheduleId: string; description?: string })[]> => {
      if (scheduleIds.length === 0) return [];
      if (!currentCase) throw new Error('No case selected');
      const schedulePromises = scheduleIds.map(async (scheduleId) => {
        const data = await getScheduleByIdAction(currentCase.caseId, currentCase.monthYear, scheduleId);
        if (!data.solution) return null;
        
        const parsedSolution = parseSolutionFile(data.solution);
        return {
          ...parsedSolution,
          scheduleId,
          description: data.description,
        };
      });
      
      const results = await Promise.all(schedulePromises);
      return results.filter((s): s is NonNullable<typeof s> => s !== null);
    },
    enabled: scheduleIds.length > 0,
  });
}
