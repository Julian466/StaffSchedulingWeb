'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { SchedulePageClient } from './schedule-page-client';

export default function SchedulePage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <SchedulePageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
