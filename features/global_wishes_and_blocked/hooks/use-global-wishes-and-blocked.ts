import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { useCase } from '@/components/case-provider';

const API_BASE = '/api/global-wishes-and-blocked';

export function useGlobalWishesAndBlocked() {
    const { currentCaseId } = useCase();
    return useQuery({
        queryKey: ['global-wishes-and-blocked', currentCaseId], queryFn: async () => {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Fehler beim Laden');
        return res.json();
        },
    });
}

export function useCreateGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCaseId } = useCase();
    return useMutation({
        mutationFn: async(data: Omit<WishesAndBlockedEmployee, 'key'>) =>
    {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Fehler beim Erstellen');
        return res.json();
    },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId]}),
    });
}

export function useUpdateGlobalWishesAndBlocked() {
    const qc = useQueryClient();
    const { currentCaseId } = useCase();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Omit<WishesAndBlockedEmployee, 'key'> }) => {
            const res = await fetch(API_BASE, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, data }),
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
            const res = await fetch(API_BASE, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error('Fehler beim Löschen');
            return res.json();
        },
            onSuccess: () => qc.invalidateQueries({ queryKey: ['global-wishes-and-blocked', currentCaseId]}),
});
}