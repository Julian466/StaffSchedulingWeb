'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { getAllGlobalWishesAction, createGlobalWishesAction, updateGlobalWishesAction, deleteGlobalWishesAction } from '../global-wishes-and-blocked.actions';

/**
 * Hook to fetch all employees with their wishes and blocked data for the current case.
 * Includes wish days, wish shifts, blocked days, and blocked shifts.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with wishes and blocked employee data
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
 * Hook to create a new wishes and blocked employee entry.
 * Note: This is typically called automatically when creating an employee.
 *
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query mutation for creating a wishes and blocked entry
 */
export function useCreateGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { data: Omit<WishesAndBlockedEmployee, 'key'>; options?: { skipSyncToMonthly?: boolean } }) => {
            const { data, options } = payload;
            return createGlobalWishesAction(caseId, monthYear, data, options);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', caseId, monthYear] });
            qc.invalidateQueries({ queryKey: ['wishes-and-blocked', caseId, monthYear] });
        },
    });
}

/**
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useUpdateGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, options }: { id: number; data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>; options?: { skipSyncToMonthly?: boolean } }): Promise<WishesAndBlockedEmployee> => {
            return updateGlobalWishesAction(caseId, monthYear, id, data, options);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', caseId, monthYear] });
            qc.invalidateQueries({ queryKey: ['wishes-and-blocked', caseId, monthYear] });
        },
    });
}

/**
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 */
export function useDeleteGlobalWishesAndBlocked(caseId: number, monthYear: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return deleteGlobalWishesAction(caseId, monthYear, id);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', caseId, monthYear] });
        },
    });
}