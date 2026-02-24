'use client';

import {useQueries} from '@tanstack/react-query';
import {ScheduleSolution} from '@/src/entities/models/schedule.model';
import {parseSolutionFile} from '@/lib/services/schedule-parser';
import {getScheduleByIdAction} from '@/features/schedule/schedule.actions';

/**
 * Hook to fetch multiple schedules by their IDs simultaneously.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @param scheduleIds - Array of schedule IDs to fetch
 * @returns Array of query results with parsed schedule data
 */
export function useMultipleSchedules(caseId: number, monthYear: string, scheduleIds: string[]) {
    return useQueries({
        queries: scheduleIds.map((scheduleId) => ({
            queryKey: ['schedule', scheduleId, caseId, monthYear],
            queryFn: async (): Promise<ScheduleSolution | null> => {
                const data = await getScheduleByIdAction(caseId, monthYear, scheduleId);

                if (!data.solution) return null;

                return parseSolutionFile(data.solution);
            },
            enabled: !!scheduleId && caseId > 0 && monthYear.length > 0,
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
