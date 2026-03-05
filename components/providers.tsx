'use client';

import {ReactNode} from 'react';
import {WorkflowProvider, WorkflowData} from '@/contexts/workflow-context';

interface ProvidersProps {
    children: ReactNode;
    workflowData?: WorkflowData | null;
}

export function Providers({children, workflowData}: ProvidersProps) {
    return (
        <WorkflowProvider initialData={workflowData}>
            {children}
        </WorkflowProvider>
    );
}
