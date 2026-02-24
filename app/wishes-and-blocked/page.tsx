'use client';

import { useCaseParams } from '@/hooks/use-case-params';
import { WishesAndBlockedPageClient } from './wishes-and-blocked-page-client';

export default function WishesAndBlockedPage() {
  const caseParams = useCaseParams();
  
  if (!caseParams) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case aus</div>;
  }
  
  return <WishesAndBlockedPageClient caseId={caseParams.caseId} monthYear={caseParams.monthYear} />;
}
