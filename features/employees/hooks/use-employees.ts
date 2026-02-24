'use client';

import { useQuery } from '@tanstack/react-query';
import { Employee } from '@/types/employee';
import { useCase } from '@/components/case-provider';
import { getAllEmployeesAction } from '../employees.actions';

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
      return getAllEmployeesAction(currentCase.caseId, currentCase.monthYear);
    },
    enabled: !!currentCase,
  });
}



