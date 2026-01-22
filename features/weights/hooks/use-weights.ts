'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Weights } from '@/types/weights';
import { useCase } from '@/components/case-provider';
import { toast } from 'sonner';

const API_URL = '/api/weights';

/**
 * Hook to fetch weights configuration for the current case.
 * Automatically includes the case ID from context in the request headers.
 * 
 * @returns React Query result with weights configuration data
 */
export function useWeights() {
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['weights', currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<Weights> => {
      if (!currentCase) throw new Error('No case selected');
      const res = await fetch(API_URL, {
        headers: {
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch weights configuration');
      return res.json();
    },
    enabled: !!currentCase,
  });
}

/**
 * Hook to update weights configuration for the current case.
 * Automatically invalidates the cache after successful update.
 * 
 * @returns React Query mutation result
 */
export function useUpdateWeights() {
  const { currentCase } = useCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weights: Weights) => {
      if (!currentCase) throw new Error('No case selected');
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,
        },
        body: JSON.stringify(weights),
      });
      if (!res.ok) throw new Error('Failed to update weights configuration');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weights', currentCase?.caseId, currentCase?.monthYear] });
      toast.success('Gewichtungen erfolgreich aktualisiert');
    },
    onError: () => {
      toast.error('Fehler beim Aktualisieren der Gewichtungen');
    },
  });
}
