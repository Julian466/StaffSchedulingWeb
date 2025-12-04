'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/http/query-client';
import { ReactNode } from 'react';
import { CaseProvider } from './case-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CaseProvider>
        {children}
      </CaseProvider>
    </QueryClientProvider>
  );
}
