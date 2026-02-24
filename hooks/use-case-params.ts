'use client';

import { useSearchParams } from 'next/navigation';

/**
 * Reads caseId and monthYear from URL search params.
 * Returns null values if params are missing/invalid.
 */
export function useCaseParams(): { caseId: number; monthYear: string } | null {
  const searchParams = useSearchParams();
  const caseIdStr = searchParams.get('caseId');
  const monthYear = searchParams.get('monthYear');

  if (!caseIdStr || !monthYear) return null;
  
  const caseId = Number(caseIdStr);
  if (isNaN(caseId) || caseId <= 0) return null;
  if (!/^(0?[1-9]|1[0-2])_\d{4}$/.test(monthYear)) return null;
  
  return { caseId, monthYear };
}
