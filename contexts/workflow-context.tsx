'use client';

import React, {createContext, ReactNode, useContext, useState} from 'react';

export interface WorkflowData {
    caseId: string;
    monthYear: string;
    startDate: string;
    endDate: string;
    isWorkflowMode: boolean;
}

interface WorkflowContextType {
    workflowData: WorkflowData | null;
    isWorkflowMode: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

interface WorkflowProviderProps {
    children: ReactNode;
    initialData?: WorkflowData | null;
}

export function WorkflowProvider({children, initialData = null}: WorkflowProviderProps) {
    const [workflowData] = useState<WorkflowData | null>(initialData);

    return (
        <WorkflowContext.Provider
            value={{
                workflowData,
                isWorkflowMode: workflowData?.isWorkflowMode ?? false,
            }}
        >
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflow() {
    const context = useContext(WorkflowContext);
    if (context === undefined) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
}
