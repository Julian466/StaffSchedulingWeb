'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { useCase } from '@/components/case-provider';

const API_BASE = '/api/global-wishes-and-blocked';

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
            const res = await fetch(API_BASE, {
                headers: {
                    'x-case-id': currentCase.caseId.toString(),
                    'x-month-year': currentCase.monthYear
                },
            });
            if (!res.ok) throw new Error('Failed to fetch global wishes and blocked employees');
            return res.json();
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
            const { data, options } = payload;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'x-case-id': currentCase.caseId.toString(),
                'x-month-year': currentCase.monthYear
            };
            if (options?.skipSyncToMonthly) {
                headers['x-skip-sync-to-monthly'] = '1';
            }
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create wishes and blocked employee');
            return res.json();
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
        mutationFn: async ({ id, data, options }: { id: number; data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>; options?: { skipSyncToMonthly?: boolean } }): Promise<WishesAndBlockedEmployee> => {
            if (!currentCase) throw new Error('No case selected');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'x-case-id': currentCase.caseId.toString(),
                'x-month-year': currentCase.monthYear
            };
            if (options?.skipSyncToMonthly) headers['x-skip-sync-to-monthly'] = '1';

            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update global wishes and blocked employee');
            return res.json();
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
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-case-id': currentCase.caseId.toString(),
                    'x-month-year': currentCase.monthYear
                },
            });
            if (!res.ok) throw new Error('Failed to delete wishes and blocked employee');
            return res.json();
        },
        onSuccess: () => { 
            if (currentCase) {
                qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCase.caseId, currentCase.monthYear] });
            }
        },
    });
}