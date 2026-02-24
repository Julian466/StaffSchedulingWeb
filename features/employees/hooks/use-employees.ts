'use client';

import { useQuery } from '@tanstack/react-query';
import { Employee } from '@/types/employee';
import { getAllEmployeesAction } from '../employees.actions';

/**
 * Hook to fetch all employees for the current case.
 * 
 * @param caseId - The case ID
 * @param monthYear - The month/year string
 * @returns React Query result with employee data
 */
export function useEmployees(caseId: number, monthYear: string) {
  return useQuery({
    queryKey: ['employees', caseId, monthYear],
    queryFn: async (): Promise<Employee[]> => {
      return getAllEmployeesAction(caseId, monthYear);
    },
    enabled: caseId > 0 && monthYear.length > 0,
  });
}



