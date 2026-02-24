'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { getAllWishesAction, createWishesAction, updateWishesAction, deleteWishesAction } from '../wishes-and-blocked.actions';

/**
 * Hook to fetch all employees with their wishes and blocked data for the current case.
 * Includes wish days, wish shifts, blocked days, and blocked shifts.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with wishes and blocked employee data
 */
export function useWishesAndBlocked(caseId: number, monthYear: string) {
  return useQuery({
    queryKey: ['wishes-and-blocked', caseId, monthYear],
    queryFn: async (): Promise<WishesAndBlockedEmployee[]> => {
      return getAllWishesAction(caseId, monthYear);
    },
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
export function useCreateWishesAndBlocked(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<WishesAndBlockedEmployee, 'key'>): Promise<WishesAndBlockedEmployee> => {
      return createWishesAction(caseId, monthYear, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes-and-blocked', caseId, monthYear] });
    },
  });
}

/**
 * Hook to update an employee's wishes and blocked data.
 * Can update wish days, wish shifts, blocked days, and blocked shifts.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query mutation for updating wishes and blocked data
 */
export function useUpdateWishesAndBlocked(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number;
      data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>
    }): Promise<WishesAndBlockedEmployee> => {
      return updateWishesAction(caseId, monthYear, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes-and-blocked', caseId, monthYear] });
    },
  });
}

/**
 * Hook to delete a wishes and blocked employee entry.
 * Note: This is typically called automatically when deleting an employee.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query mutation for deleting a wishes and blocked entry
 */
export function useDeleteWishesAndBlocked(caseId: number, monthYear: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      return deleteWishesAction(caseId, monthYear, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes-and-blocked', caseId, monthYear] });
    },
  });
}
