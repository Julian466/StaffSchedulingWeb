'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { SolverPageClient } from './solver-page-client';

export default function SolverPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <SolverPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
