'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { WeightsPageClient } from './weights-page-client';

export default function WeightsPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <WeightsPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
