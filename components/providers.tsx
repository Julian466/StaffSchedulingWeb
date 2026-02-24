'use client';

import {ReactNode} from 'react';
import {WorkflowProvider} from '@/contexts/workflow-context';

export function Providers({children}: { children: ReactNode }) {
    return (
        <WorkflowProvider>
            {children}
        </WorkflowProvider>
    );
}
