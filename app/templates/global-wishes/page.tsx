'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { GlobalWishesTemplatesPageClient } from './global-wishes-page-client';

export default function GlobalWishesTemplatesPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <GlobalWishesTemplatesPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
