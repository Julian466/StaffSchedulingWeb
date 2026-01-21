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
    const { currentCaseId } = useCase();

    return useQuery({
        queryKey: ['global-wishes-and-blocked', currentCaseId],
        queryFn: async () => {
        const res = await fetch(API_BASE, {
            headers: { 'x-case-id': currentCaseId.toString() },
        });
        if (!res.ok) throw new Error('Failed to fetch wishes and blocked employees');
        return res.json();
        },
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
    const { currentCaseId } = useCase();
    return useMutation({
        mutationFn: async(payload: { data: Omit<WishesAndBlockedEmployee, 'key'>; options?: { skipSyncToMonthly?: boolean } }) =>
    {
        const { data, options } = payload;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-case-id': currentCaseId.toString(),
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
            qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId] });
            qc.invalidateQueries({ queryKey: ['wishes-and-blocked',     currentCaseId] });
        },
    });
}

export function useUpdateGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCaseId } = useCase();

    return useMutation({
        mutationFn: async ({ id, data, options }: { id: number; data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>; options?: { skipSyncToMonthly?: boolean } }): Promise<WishesAndBlockedEmployee> => {
            const headers: Record<string,string> = {
                'Content-Type': 'application/json',
                'x-case-id': currentCaseId.toString(),
            };
            if (options?.skipSyncToMonthly) headers['x-skip-sync-to-monthly'] = '1';

            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update wishes and blocked employee');
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId] });
            qc.invalidateQueries({ queryKey: ['wishes-and-blocked',     currentCaseId] });
        },
});
}

export function useDeleteGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCaseId } = useCase();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-case-id': currentCaseId.toString(),
                },
            });
            if (!res.ok) throw new Error('Failed to delete wishes and blocked employee');
            return res.json();
        },
            onSuccess: () => qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId]}),
});
}