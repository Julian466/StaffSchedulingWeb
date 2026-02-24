'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {SchedulesMetadata, ScheduleSolution, ScheduleSolutionRaw} from '@/src/entities/models/schedule.model';
import {parseSolutionFile} from '@/lib/services/schedule-parser';
import {
    deleteScheduleAction,
    getScheduleByIdAction,
    getSchedulesMetadataAction,
    getSelectedScheduleAction,
    saveScheduleAction,
    selectScheduleAction,
    updateScheduleMetadataAction,
} from '@/features/schedule/schedule.actions';

/**
 * Hook to fetch all schedules metadata for the current case.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with schedules metadata
 */
export function useSchedulesMetadata(caseId: number, monthYear: string) {
    return useQuery({
        queryKey: ['schedules-metadata', caseId, monthYear],
        queryFn: async (): Promise<SchedulesMetadata> => {
            return getSchedulesMetadataAction(caseId, monthYear);
        },
        enabled: caseId > 0 && monthYear.length > 0,
    });
}

/**
 * Hook to fetch the currently selected schedule solution.
 * Parses the raw solution data into a usable format with fulfilled wishes.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with parsed schedule data
 */
export function useSchedule(caseId: number, monthYear: string) {
    return useQuery({
        queryKey: ['schedule', 'selected', caseId, monthYear],
        queryFn: async (): Promise<ScheduleSolution | null> => {
            const data = await getSelectedScheduleAction(caseId, monthYear);

            // Return null if no schedule exists yet
            if (!data.solution) return null;

            // Parse the raw solution data
            return parseSolutionFile(data.solution);
        },
        enabled: caseId > 0 && monthYear.length > 0,
    });
}

/**
 * Hook to fetch a specific schedule solution by ID.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @param scheduleId - The ID of the schedule to fetch
 * @returns React Query result with parsed schedule data
 */
export function useScheduleById(caseId: number, monthYear: string, scheduleId: string | null) {
    return useQuery({
        queryKey: ['schedule', scheduleId, caseId, monthYear],
        queryFn: async (): Promise<ScheduleSolution | null> => {
            if (!scheduleId) return null;

            const data = await getScheduleByIdAction(caseId, monthYear, scheduleId);

            if (!data.solution) return null;

            return parseSolutionFile(data.solution);
        },
        enabled: !!scheduleId && caseId > 0 && monthYear.length > 0,
    });
}

/**
 * Hook to save a new schedule solution with optional description.
 * Invalidates relevant query caches on success.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns Mutation function to save schedule
 */
export function useSaveSchedule(caseId: number, monthYear: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            scheduleId: string;
            description?: string;
            solution: ScheduleSolutionRaw;
            autoSelect?: boolean;
        }) => {
            return saveScheduleAction(
                caseId,
                monthYear,
                params.scheduleId,
                params.solution,
                params.description,
                params.autoSelect,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['schedule', caseId, monthYear]});
            queryClient.invalidateQueries({queryKey: ['schedules-metadata', caseId, monthYear]});
        },
    });
}

/**
 * Hook to select a schedule as the active one.
 * Invalidates relevant query caches on success.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns Mutation function to select schedule
 */
export function useSelectSchedule(caseId: number, monthYear: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (scheduleId: string) => {
            return selectScheduleAction(caseId, monthYear, scheduleId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['schedule', caseId, monthYear]});
            queryClient.invalidateQueries({queryKey: ['schedules-metadata', caseId, monthYear]});
        },
    });
}

/**
 * Hook to delete a specific schedule.
 * Invalidates relevant query caches on success.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns Mutation function to delete schedule
 */
export function useDeleteSchedule(caseId: number, monthYear: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (scheduleId: string) => {
            return deleteScheduleAction(caseId, monthYear, scheduleId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['schedule', caseId, monthYear]});
            queryClient.invalidateQueries({queryKey: ['schedules-metadata', caseId, monthYear]});
        },
    });
}

/**
 * Hook to update schedule metadata (e.g., description).
 * Invalidates relevant query caches on success.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns Mutation function to update schedule
 */
export function useUpdateSchedule(caseId: number, monthYear: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { scheduleId: string; description?: string; comment?: string }) => {
            return updateScheduleMetadataAction(
                caseId,
                monthYear,
                params.scheduleId,
                {description: params.description, comment: params.comment},
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['schedules-metadata', caseId, monthYear]});
        },
    });
}

/**
 * Hook to fetch multiple schedule solutions by their IDs.
 * Used for comparing multiple schedules side by side.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @param scheduleIds - Array of schedule IDs to fetch
 * @returns React Query result with array of parsed schedule data
 */
export function useMultipleSchedules(caseId: number, monthYear: string, scheduleIds: string[]) {
    return useQuery({
        queryKey: ['schedules', 'multiple', scheduleIds.sort(), caseId, monthYear],
        queryFn: async (): Promise<(ScheduleSolution & { scheduleId: string; description?: string })[]> => {
            if (scheduleIds.length === 0) return [];
            const schedulePromises = scheduleIds.map(async (scheduleId) => {
                const data = await getScheduleByIdAction(caseId, monthYear, scheduleId);
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
        enabled: scheduleIds.length > 0 && caseId > 0 && monthYear.length > 0,
    });
}
