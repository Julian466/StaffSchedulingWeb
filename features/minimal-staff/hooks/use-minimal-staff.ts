'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MinimalStaffRequirements } from '@/types/minimal-staff';
import { useCase } from '@/components/case-provider';
import { toast } from 'sonner';
import { getMinimalStaffAction, updateMinimalStaffAction } from '../minimal-staff.actions';

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
      return getMinimalStaffAction(currentCase.caseId, currentCase.monthYear);
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
      return updateMinimalStaffAction(currentCase.caseId, currentCase.monthYear, requirements);
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
