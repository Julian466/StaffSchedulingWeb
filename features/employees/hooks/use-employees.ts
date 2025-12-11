'use client';

import { useQuery } from '@tanstack/react-query';
import { Employee } from '@/types/employee';
import { useCase } from '@/components/case-provider';

const API_URL = '/api/employees';

/**
 * Hook to fetch all employees for the current case.
 * Automatically includes the case ID from context in the request headers.
 * 
 * @returns React Query result with employee data
 */
export function useEmployees() {
  const { currentCaseId } = useCase();
  
  return useQuery({
    queryKey: ['employees', currentCaseId],
    queryFn: async (): Promise<Employee[]> => {
      const res = await fetch(API_URL, {
        headers: { 'x-case-id': currentCaseId.toString() },
      });
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
  });
}



