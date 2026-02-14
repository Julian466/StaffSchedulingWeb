'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Case, CaseUnit } from '@/types/case';
import { useWorkflow } from '@/contexts/workflow-context';

interface CaseContextType {
  currentCase: Case | null;
  currentCaseId: number; // Convenience property for backward compatibility
  availableCases: CaseUnit[];
  switchCase: (caseId: number, monthYear: string) => Promise<void>;
  createNewCase: (unitId: number, month: number, year: number) => Promise<void>;
  refreshCases: () => Promise<CaseUnit[]>;
  isLoading: boolean;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const { workflowData } = useWorkflow();
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [availableCases, setAvailableCases] = useState<CaseUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workflowCaseApplied, setWorkflowCaseApplied] = useState(false);

  const refreshCases = async (): Promise<CaseUnit[]> => {
    try {
      const response = await fetch('/api/cases');
      const data = await response.json();
      const units = data.units || [];
      setAvailableCases(units);
      return units;
    } catch (error) {
      console.error('Failed to refresh cases:', error);
      return [];
    }
  };

  const switchCase = async (caseId: number, monthYear: string) => {
    setIsLoading(true);
    
    // Parse monthYear to get month and year
    const [monthStr, yearStr] = monthYear.split('_');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    const newCase: Case = {
      caseId,
      monthYear,
      month,
      year
    };
    
    setCurrentCase(newCase);
    localStorage.setItem('currentCase', JSON.stringify(newCase));
    setIsLoading(false);
  };

  const createNewCase = async (unitId: number, month: number, year: number): Promise<void> => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, month, year }),
      });
      const data = await response.json();
      await refreshCases();
      await switchCase(unitId, data.monthYear);
    } catch (error) {
      console.error('Failed to create case:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeCase = async () => {
      setIsLoading(true);
      const units = await refreshCases();

      // Check if workflow mode is active and use workflow case + derived monthYear
      if (workflowData?.caseId && workflowData?.monthYear && !workflowCaseApplied) {
        const workflowCaseId = parseInt(workflowData.caseId);
        await switchCase(workflowCaseId, workflowData.monthYear);
        setWorkflowCaseApplied(true);
      } else if (!workflowData?.caseId) {
        // Try to load last used case from localStorage only if not in workflow mode
        const savedCaseStr = localStorage.getItem('currentCase');
        if (savedCaseStr) {
          try {
            const savedCase = JSON.parse(savedCaseStr);
            setCurrentCase(savedCase);
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('Failed to parse saved case:', error);
          }
        }

        // If no saved case exists, automatically select the first available case
        if (units.length > 0) {
          const firstUnit = units[0];
          if (firstUnit.months.length > 0) {
            const firstMonth = firstUnit.months[0];
            console.log(`Auto-selecting first available case: Unit ${firstUnit.unitId}, Month ${firstMonth}`);
            await switchCase(firstUnit.unitId, firstMonth);
          }
        }
      }

      setIsLoading(false);
    };

    initializeCase();
  }, [workflowData?.caseId, workflowData?.monthYear]);

  return (
    <CaseContext.Provider
      value={{
        currentCase,
        currentCaseId: currentCase?.caseId || 1, // Default to 1 for backward compatibility
        availableCases,
        switchCase,
        createNewCase,
        refreshCases,
        isLoading,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
}
