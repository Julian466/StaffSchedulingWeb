'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Weights} from '@/src/entities/models/weights.model';
import {toast} from 'sonner';
import {getWeightsAction, updateWeightsAction} from '../weights.actions';

/**
 * Hook to fetch weights configuration for the current case.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with weights configuration data
 */
export function useWeights(caseId: number, monthYear: string) {
    return useQuery({
        queryKey: ['weights', caseId, monthYear],
        queryFn: async (): Promise<Weights> => {
            return getWeightsAction(caseId, monthYear);
        },
        enabled: caseId > 0 && monthYear.length > 0,
    });
}

/**
 * Hook to update weights configuration for the current case.
 * Automatically invalidates the cache after successful update.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query mutation result
 */
export function useUpdateWeights(caseId: number, monthYear: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (weights: Weights) => {
            return updateWeightsAction(caseId, monthYear, weights);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['weights', caseId, monthYear]});
            toast.success('Gewichtungen erfolgreich aktualisiert');
        },
        onError: () => {
            toast.error('Fehler beim Aktualisieren der Gewichtungen');
        },
    });
}
