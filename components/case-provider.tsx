'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CaseInformation } from '@/types/case';

interface CaseContextType {
  currentCaseId: number;
  caseInformation: CaseInformation | null;
  availableCases: number[];
  switchCase: (caseId: number) => Promise<void>;
  createNewCase: () => Promise<number>;
  updateCaseInformation: (month: number, year: number) => Promise<void>;
  refreshCases: () => Promise<void>;
  isLoading: boolean;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [currentCaseId, setCurrentCaseId] = useState<number>(1);
  const [caseInformation, setCaseInformation] = useState<CaseInformation | null>(null);
  const [availableCases, setAvailableCases] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCases = async () => {
    try {
      const response = await fetch('/api/cases');
      const data = await response.json();
      setAvailableCases(data.cases || []);

      // If no cases exist, create the first one
      if (data.cases.length === 0) {
        await createNewCase();
      }
    } catch (error) {
      console.error('Failed to refresh cases:', error);
    }
  };

  const loadCaseInformation = async (caseId: number) => {
    try {
      const response = await fetch(`/api/cases/${caseId}/information`);
      if (response.ok) {
        const data = await response.json();
        setCaseInformation(data.information);
      } else {
        setCaseInformation(null);
      }
    } catch (error) {
      console.error('Failed to load case information:', error);
      setCaseInformation(null);
    }
  };

  const switchCase = async (caseId: number) => {
    setIsLoading(true);
    setCurrentCaseId(caseId);
    await loadCaseInformation(caseId);
    localStorage.setItem('currentCaseId', caseId.toString());
    setIsLoading(false);
  };

  const createNewCase = async (): Promise<number> => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
      });
      const data = await response.json();
      await refreshCases();
      await switchCase(data.caseId);
      return data.caseId;
    } catch (error) {
      console.error('Failed to create case:', error);
      throw error;
    }
  };

  const updateCaseInformation = async (month: number, year: number) => {
    try {
      const response = await fetch(`/api/cases/${currentCaseId}/information`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year }),
      });
      if (response.ok) {
        const data = await response.json();
        setCaseInformation(data.information);
      }
    } catch (error) {
      console.error('Failed to update case information:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeCase = async () => {
      setIsLoading(true);
      await refreshCases();

      // Try to load last used case from localStorage
      const savedCaseId = localStorage.getItem('currentCaseId');
      const initialCaseId = savedCaseId ? parseInt(savedCaseId) : 1;

      await loadCaseInformation(initialCaseId);
      setCurrentCaseId(initialCaseId);
      setIsLoading(false);
    };

    initializeCase();
  }, []);

  return (
    <CaseContext.Provider
      value={{
        currentCaseId,
        caseInformation,
        availableCases,
        switchCase,
        createNewCase,
        updateCaseInformation,
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
