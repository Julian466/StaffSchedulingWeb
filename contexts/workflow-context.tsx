'use client';

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getWorkflowEnvAction} from '@/features/workflow/workflow.actions';

interface WorkflowData {
    caseId: string;
    monthYear: string;
    startDate: string;
    endDate: string;
    isWorkflowMode: boolean;
}

interface WorkflowContextType {
    workflowData: WorkflowData | null;
    setWorkflowData: (data: WorkflowData | null) => void;
    clearWorkflowData: () => void;
    isWorkflowMode: boolean;
    isLoading: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

/**
 * Derives monthYear in MM_YYYY format from a date string.
 *
 * @param dateStr - Date string (e.g., "2024-11-01")
 * @returns MonthYear string (e.g., "11_2024")
 */
function deriveMonthYearFromDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}_${year}`;
}

export function WorkflowProvider({children}: { children: ReactNode }) {
    const [workflowData, setWorkflowDataState] = useState<WorkflowData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check server environment variables on mount
    useEffect(() => {
        const checkWorkflowMode = async () => {
            try {
                const data = await getWorkflowEnvAction();

                if (data.isWorkflowMode && data.caseId && data.startDate && data.endDate) {
                    // Derive monthYear from startDate
                    const monthYear = deriveMonthYearFromDate(data.startDate);

                    setWorkflowDataState({
                        caseId: data.caseId,
                        monthYear,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        isWorkflowMode: true
                    });
                }
            } catch (error) {
                console.error('Failed to check workflow mode:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkWorkflowMode();
    }, []);

    const setWorkflowData = (data: WorkflowData | null) => {
        setWorkflowDataState(data);
    };

    const clearWorkflowData = () => {
        setWorkflowDataState(null);
    };

    return (
        <WorkflowContext.Provider
            value={{
                workflowData,
                setWorkflowData,
                clearWorkflowData,
                isWorkflowMode: workflowData?.isWorkflowMode ?? false,
                isLoading,
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
