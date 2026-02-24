'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { MinimalStaffPageClient } from './minimal-staff-page-client';

export default function MinimalStaffPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <MinimalStaffPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
