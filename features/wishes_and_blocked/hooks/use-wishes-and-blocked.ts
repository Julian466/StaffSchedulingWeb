'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { useCase } from '@/components/case-provider';

const API_URL = '/api/wishes-and-blocked';

/**
 * Hook to fetch all employees with their wishes and blocked data for the current case.
 * Includes wish days, wish shifts, blocked days, and blocked shifts.
 * 
 * @returns React Query result with wishes and blocked employee data
 */
export function useWishesAndBlocked() {
  const { currentCaseId } = useCase();
  
  return useQuery({
    queryKey: ['wishes-and-blocked', currentCaseId],
    queryFn: async (): Promise<WishesAndBlockedEmployee[]> => {
      const res = await fetch(API_URL, {
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
export function useCreateWishesAndBlocked() {
  const queryClient = useQueryClient();
  const { currentCaseId } = useCase();
  
  return useMutation({
    mutationFn: async (data: Omit<WishesAndBlockedEmployee, 'key'>): Promise<WishesAndBlockedEmployee> => {
      const res = await fetch(API_URL, {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes-and-blocked', currentCaseId] });
    },
  });
}

/**
 * Hook to update an employee's wishes and blocked data.
 * Can update wish days, wish shifts, blocked days, and blocked shifts.
 * 
 * @returns React Query mutation for updating wishes and blocked data
 */
export function useUpdateWishesAndBlocked() {
  const queryClient = useQueryClient();
  const { currentCaseId } = useCase();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number;
      data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>
    }): Promise<WishesAndBlockedEmployee> => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-case-id': currentCaseId.toString(),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update wishes and blocked employee');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes-and-blocked', currentCaseId] });
    },
  });
}

/**
 * Hook to delete a wishes and blocked employee entry.
 * Note: This is typically called automatically when deleting an employee.
 * 
 * @returns React Query mutation for deleting a wishes and blocked entry
 */
export function useDeleteWishesAndBlocked() {
  const queryClient = useQueryClient();
  const { currentCaseId } = useCase();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'x-case-id': currentCaseId.toString() },
      });
      if (!res.ok) throw new Error('Failed to delete wishes and blocked employee');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes-and-blocked', currentCaseId] });
    },
  });
}
