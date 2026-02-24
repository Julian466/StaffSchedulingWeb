'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { MinimalStaffTemplatesPageClient } from './minimal-staff-page-client';

export default function MinimalStaffTemplatesPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <MinimalStaffTemplatesPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
