'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ScheduleSolution, ScheduleSolutionRaw, SchedulesMetadata } from '@/types/schedule';
import { useCase } from '@/components/case-provider';
import { parseSolutionFile } from '@/lib/services/schedule-parser';

const API_URL = '/api/schedule';

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
      const res = await fetch(API_URL, {
        headers: { 'x-case-id': currentCase.caseId.toString(), 'x-month-year': currentCase.monthYear },
      });
      if (!res.ok) throw new Error('Failed to fetch schedules metadata');
      return res.json();
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
      const res = await fetch(`${API_URL}/selected`, {
        headers: { 'x-case-id': currentCase.caseId.toString(), 'x-month-year': currentCase.monthYear },
      });
      if (!res.ok) throw new Error('Failed to fetch schedule');
      
      const data = await res.json();
      
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
      
      const res = await fetch(`${API_URL}/${scheduleId}`, {
        headers: { 'x-case-id': currentCase.caseId.toString(), 'x-month-year': currentCase.monthYear },
      });
      if (!res.ok) throw new Error('Failed to fetch schedule');
      
      const data = await res.json();
      
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,
        },
        body: JSON.stringify(params),
      });
      
      if (!res.ok) throw new Error('Failed to save schedule');
      return res.json();
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
      const res = await fetch(`${API_URL}/${scheduleId}/select`, {
        method: 'POST',
        headers: { 'x-case-id': currentCase.caseId.toString(), 'x-month-year': currentCase.monthYear },
      });
      
      if (!res.ok) throw new Error('Failed to select schedule');
      return res.json();
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
      const res = await fetch(`${API_URL}/${scheduleId}`, {
        method: 'DELETE',
        headers: { 'x-case-id': currentCase.caseId.toString(), 'x-month-year': currentCase.monthYear },
      });
      
      if (!res.ok) throw new Error('Failed to delete schedule');
      return res.json();
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
      const res = await fetch(`${API_URL}/${params.scheduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,
        },
        body: JSON.stringify({ description: params.description, comment: params.comment }),
      });
      
      if (!res.ok) throw new Error('Failed to update schedule');
      return res.json();
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
        const res = await fetch(`${API_URL}/${scheduleId}`, {
          headers: { 'x-case-id': currentCase.caseId.toString(), 'x-month-year': currentCase.monthYear },
        });
        if (!res.ok) throw new Error(`Failed to fetch schedule ${scheduleId}`);
        
        const data = await res.json();
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
