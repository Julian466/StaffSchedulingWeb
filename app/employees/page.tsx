'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { EmployeesPageClient } from './employees-page-client';

export default function EmployeesPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <EmployeesPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
