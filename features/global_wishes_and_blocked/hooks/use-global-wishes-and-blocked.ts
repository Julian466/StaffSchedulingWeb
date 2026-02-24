'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { useCase } from '@/components/case-provider';
import { getAllGlobalWishesAction, createGlobalWishesAction, updateGlobalWishesAction, deleteGlobalWishesAction } from '../global-wishes-and-blocked.actions';

/**
 * Hook to fetch all employees with their wishes and blocked data for the current case.
 * Includes wish days, wish shifts, blocked days, and blocked shifts.
 *
 * @returns React Query result with wishes and blocked employee data
 */
export function useGlobalWishesAndBlocked() {
    const { currentCase } = useCase();

    return useQuery({
        queryKey: ['global-wishes-and-blocked', currentCase?.caseId, currentCase?.monthYear],
        queryFn: async () => {
            if (!currentCase) throw new Error('No case selected');
            return getAllGlobalWishesAction(currentCase.caseId, currentCase.monthYear);
        },
        enabled: !!currentCase,
    });
}

/**
 * Hook to create a new wishes and blocked employee entry.
 * Note: This is typically called automatically when creating an employee.
 *
 * @returns React Query mutation for creating a wishes and blocked entry
 */
export function useCreateGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCase } = useCase();
    return useMutation({
        mutationFn: async (payload: { data: Omit<WishesAndBlockedEmployee, 'key'>; options?: { skipSyncToMonthly?: boolean } }) => {
            if (!currentCase) throw new Error('No case selected');
            const { data } = payload;
            return createGlobalWishesAction(currentCase.caseId, currentCase.monthYear, data);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCase?.caseId, currentCase?.monthYear] });
            qc.invalidateQueries({ queryKey: ['wishes-and-blocked', currentCase?.caseId, currentCase?.monthYear] });
        },
    });
}

export function useUpdateGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCase } = useCase();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>; options?: { skipSyncToMonthly?: boolean } }): Promise<WishesAndBlockedEmployee> => {
            if (!currentCase) throw new Error('No case selected');
            return updateGlobalWishesAction(currentCase.caseId, currentCase.monthYear, id, data);
        },
        onSuccess: () => {
            if (currentCase) {
                qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCase.caseId, currentCase.monthYear] });
                qc.invalidateQueries({ queryKey: ['wishes-and-blocked', currentCase.caseId, currentCase.monthYear] });
            }
        },
    });
}

export function useDeleteGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCase } = useCase();
    return useMutation({
        mutationFn: async (id: number) => {
            if (!currentCase) throw new Error('No case selected');
            return deleteGlobalWishesAction(currentCase.caseId, currentCase.monthYear, id);
        },
        onSuccess: () => { 
            if (currentCase) {
                qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCase.caseId, currentCase.monthYear] });
            }
        },
    });
}