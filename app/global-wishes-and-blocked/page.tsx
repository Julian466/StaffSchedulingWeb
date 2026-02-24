'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { GlobalWishesAndBlockedPageClient } from './global-wishes-and-blocked-page-client';

export default function GlobalWishesAndBlockedPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <GlobalWishesAndBlockedPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
