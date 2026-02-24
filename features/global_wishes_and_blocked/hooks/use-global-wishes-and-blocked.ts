'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';
import {
    createGlobalWishesAction,
    deleteGlobalWishesAction,
    getAllGlobalWishesAction,
    updateGlobalWishesAction
} from '../global-wishes-and-blocked.actions';

/**
 * Hook to fetch all employees with their wishes and blocked data for the current case.
 */
export function useGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    return useQuery({
        queryKey: ['global-wishes-and-blocked', caseId, monthYear],
        queryFn: async () => {
            return getAllGlobalWishesAction(caseId, monthYear);
        },
        enabled: caseId > 0 && monthYear.length > 0,
    });
}

/**
 * Hook to create a new global wishes entry.
 * Also deletes and regenerates the monthly wishes for that employee.
 */
export function useCreateGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (entry: WishesAndBlockedEmployee) => {
            return createGlobalWishesAction(caseId, monthYear, entry);
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['global-wishes-and-blocked', caseId, monthYear]});
            qc.invalidateQueries({queryKey: ['wishes-and-blocked', caseId, monthYear]});
        },
    });
}

/**
 * Hook to update a global wishes entry.
 * Also deletes and regenerates the monthly wishes for that employee.
 */
export function useUpdateGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({id, data}: {
            id: number;
            data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>;
        }): Promise<void> => {
            return updateGlobalWishesAction(caseId, monthYear, id, data);
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['global-wishes-and-blocked', caseId, monthYear]});
            qc.invalidateQueries({queryKey: ['wishes-and-blocked', caseId, monthYear]});
        },
    });
}

/**
 * Hook to delete a global wishes entry.
 * Also deletes the monthly wishes for that employee.
 */
export function useDeleteGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return deleteGlobalWishesAction(caseId, monthYear, id);
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['global-wishes-and-blocked', caseId, monthYear]});
            qc.invalidateQueries({queryKey: ['wishes-and-blocked', caseId, monthYear]});
        },
    });
}