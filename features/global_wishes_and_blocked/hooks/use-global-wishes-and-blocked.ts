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
        mutationFn: async(data: Omit<WishesAndBlockedEmployee, 'key'>) =>
    {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-case-id': currentCaseId.toString(),
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create wishes and blocked employee');
        return res.json();
    },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId]}),
    });
}

export function useUpdateGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCaseId } = useCase();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<WishesAndBlockedEmployee, 'key'>> }): Promise<WishesAndBlockedEmployee> => {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-case-id': currentCaseId.toString(),
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Fehler beim Aktualisieren');
            return res.json();
        },
            onSuccess: () => qc.invalidateQueries({queryKey: ['global-wishes-and-blocked', currentCaseId]}),
});
}

export function useDeleteGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCaseId } = useCase();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error('Failed to delete wishes and blocked employee');
            return res.json();
        },
            onSuccess: () => qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId]}),
});
}