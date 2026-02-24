'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MinimalStaffRequirements } from '@/types/minimal-staff';
import { toast } from 'sonner';
import { getMinimalStaffAction, updateMinimalStaffAction } from '../minimal-staff.actions';

/**
 * Hook to fetch minimal staff requirements for the current case.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with minimal staff requirements data
 */
export function useMinimalStaff(caseId: number, monthYear: string) {
  return useQuery({
    queryKey: ['minimal-staff', caseId, monthYear],
    queryFn: async (): Promise<MinimalStaffRequirements> => {
      return getMinimalStaffAction(caseId, monthYear);
    },
    enabled: caseId > 0 && monthYear.length > 0,
  });
}

/**
 * Hook to update minimal staff requirements for the current case.
 * Automatically invalidates the cache after successful update.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query mutation result
 */
export function useUpdateMinimalStaff(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requirements: MinimalStaffRequirements) => {
      return updateMinimalStaffAction(caseId, monthYear, requirements);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minimal-staff', caseId, monthYear] });
      toast.success('Mindestbesetzung erfolgreich aktualisiert');
    },
    onError: () => {
      toast.error('Fehler beim Aktualisieren der Mindestbesetzung');
    },
  });
}
