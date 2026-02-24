'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/http/query-client';
import { ReactNode } from 'react';
import { WorkflowProvider } from '@/contexts/workflow-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkflowProvider>
        {children}
      </WorkflowProvider>
    </QueryClientProvider>
  );
}
