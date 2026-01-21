'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MinimalStaffRequirements } from '@/types/minimal-staff';
import { useCase } from '@/components/case-provider';
import { toast } from 'sonner';

const API_URL = '/api/minimal-staff';

/**
 * Hook to fetch minimal staff requirements for the current case.
 * Automatically includes the case ID from context in the request headers.
 * 
 * @returns React Query result with minimal staff requirements data
 */
export function useMinimalStaff() {
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['minimal-staff', currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<MinimalStaffRequirements> => {
      if (!currentCase) throw new Error('No case selected');
      const res = await fetch(API_URL, {
        headers: {
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch minimal staff requirements');
      return res.json();
    },
    enabled: !!currentCase,
  });
}

/**
 * Hook to update minimal staff requirements for the current case.
 * Automatically invalidates the cache after successful update.
 * 
 * @returns React Query mutation result
 */
export function useUpdateMinimalStaff() {
  const { currentCase } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requirements: MinimalStaffRequirements) => {
      if (!currentCase) throw new Error('No case selected');
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,
        },
        body: JSON.stringify(requirements),
      });
      if (!res.ok) throw new Error('Failed to update minimal staff requirements');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minimal-staff', currentCase?.caseId, currentCase?.monthYear] });
      toast.success('Mindestbesetzung erfolgreich aktualisiert');
    },
    onError: () => {
      toast.error('Fehler beim Aktualisieren der Mindestbesetzung');
    },
  });
}
