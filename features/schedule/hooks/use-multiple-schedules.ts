'use client';

import { useQueries } from '@tanstack/react-query';
import { ScheduleSolution } from '@/types/schedule';
import { useCase } from '@/components/case-provider';
import { parseSolutionFile } from '@/lib/services/schedule-parser';

const API_URL = '/api/schedule';

/**
 * Hook to fetch multiple schedules by their IDs simultaneously.
 * 
 * @param scheduleIds - Array of schedule IDs to fetch
 * @returns Array of query results with parsed schedule data
 */
export function useMultipleSchedules(scheduleIds: string[]) {
  const { currentCase } = useCase();
  
  return useQueries({
    queries: scheduleIds.map((scheduleId) => ({
      queryKey: ['schedule', scheduleId, currentCase?.caseId, currentCase?.monthYear],
      queryFn: async (): Promise<ScheduleSolution | null> => {
        if (!currentCase) throw new Error('No case selected');
        const res = await fetch(`${API_URL}/${scheduleId}`, {
          headers: { 
            'x-case-id': currentCase.caseId.toString(), 
            'x-month-year': currentCase.monthYear },
        });
        if (!res.ok) throw new Error('Failed to fetch schedule');
        
        const data = await res.json();
        
        if (!data.solution) return null;
        
        return parseSolutionFile(data.solution);
      },
      enabled: !!scheduleId,
    })),
  });
}

/**
 * Result type for multiple schedule queries with metadata.
 */
export interface ScheduleWithMetadata {
  scheduleId: string;
  seed: number;
  schedule: ScheduleSolution | null;
  isLoading: boolean;
  error: Error | null;
}
