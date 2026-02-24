'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { TemplatesPageClient } from './templates-page-client';

export default function TemplatesPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <TemplatesPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
