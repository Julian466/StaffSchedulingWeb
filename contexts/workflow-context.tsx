'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WorkflowData {
  caseId: string;
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

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflowData, setWorkflowDataState] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check server environment variables on mount
  useEffect(() => {
    const checkWorkflowMode = async () => {
      try {
        const response = await fetch('/api/workflow/env');
        const data = await response.json();
        
        if (data.isWorkflowMode && data.caseId && data.startDate && data.endDate) {
          setWorkflowDataState({
            caseId: data.caseId,
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
