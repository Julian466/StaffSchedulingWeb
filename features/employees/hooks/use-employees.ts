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
  const { currentCase } = useCase();
  
  return useQuery({
    queryKey: ['employees', currentCase?.caseId, currentCase?.monthYear],
    queryFn: async (): Promise<Employee[]> => {
      if (!currentCase) throw new Error('No case selected');
      const res = await fetch(API_URL, {
        headers: {
          'x-case-id': currentCase.caseId.toString(),
          'x-month-year': currentCase.monthYear,},
      });
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
    enabled: !!currentCase,
  });
}



