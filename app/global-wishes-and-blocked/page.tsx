'use client';

import { useCase } from '@/components/case-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GlobalWishesAndBlockedRedirect() {
  const { currentCase, isLoading } = useCase();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && currentCase) {
      router.replace(`/cases/${currentCase.caseId}/${currentCase.monthYear}/global-wishes-and-blocked`);
    }
  }, [currentCase, isLoading, router]);
  
  return <div className="flex items-center justify-center h-64"><span className="animate-spin">⏳</span></div>;
}
