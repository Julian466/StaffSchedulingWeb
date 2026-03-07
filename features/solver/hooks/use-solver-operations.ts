'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    importSolution,
    solverDelete,
    solverFetch,
    solverInsert,
    solverSolve,
    solverSolveMultiple,
} from '@/features/solver/solver.actions';
import type { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';

export interface SolverExecOptions {
    caseId: number;
    monthYear: string;
    start: string;
    end: string;
}

export interface ImportDialogParams {
    caseId: number;
    start: string;
    end: string;
    solutionType: string;
    solution: ScheduleSolutionRaw;       // ← neu
}

export interface MultipleImportDialogParams {
    caseId: number;
    start: string;
    end: string;
    solutionCount: number;
    feasibleSolutions?: number[];
    solutions: ScheduleSolutionRaw[];    // ← neu
}

export interface SolverOperationResult {
    succeeded: boolean;
}

interface UseSolverOperationsOptions {
    onAfterOperation?: () => Promise<void>;
}

export function useSolverOperations({ onAfterOperation }: UseSolverOperationsOptions = {}) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [executionStartTime, setExecutionStartTime] = useState<number | null>(null);
    const currentTimeoutMsRef = useRef<number>(60_000);

    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importDialogParams, setImportDialogParams] = useState<ImportDialogParams | null>(null);

    const [showMultipleImportDialog, setShowMultipleImportDialog] = useState(false);
    const [multipleImportDialogParams, setMultipleImportDialogParams] = useState<MultipleImportDialogParams | null>(null);

    useEffect(() => {
        if (!isExecuting || executionStartTime === null) {
            setProgress(0);
            return;
        }
        const timeoutMs = currentTimeoutMsRef.current;
        const interval = setInterval(() => {
            const elapsed = Date.now() - executionStartTime;
            setProgress(Math.min((elapsed / timeoutMs) * 100, 99));
        }, 100);
        return () => clearInterval(interval);
    }, [isExecuting, executionStartTime]);

    useEffect(() => {
        if (!isExecuting) {
            setProgress(0);
            setExecutionStartTime(null);
        }
    }, [isExecuting]);

    const startExecution = (timeoutMs: number) => {
        currentTimeoutMsRef.current = timeoutMs;
        setExecutionStartTime(Date.now());
        setProgress(0);
        setIsExecuting(true);
    };

    const finishExecution = async () => {
        setIsExecuting(false);
        await onAfterOperation?.();
    };

    async function executeFetch(opts: SolverExecOptions): Promise<SolverOperationResult> {
        startExecution(60_000);
        try {
            const result = await solverFetch(opts.caseId, opts.monthYear, {
                unit: opts.caseId,
                start: opts.start,
                end: opts.end,
            });
            if (!result.success) {
                toast.error(result.error);
                return { succeeded: false };
            }
            if (result.data.job.status === 'completed') {
                toast.success('Daten erfolgreich von der Datenbank abgerufen');
                return { succeeded: true };
            }
            toast.error('Fehler beim Abrufen der Daten', { description: result.data.job.error ?? result.data.job.consoleOutput });
            return { succeeded: false };
        } finally {
            await finishExecution();
        }
    }

    async function executeSolve(opts: SolverExecOptions, timeout: number): Promise<SolverOperationResult> {
        startExecution(timeout * 1_000 + 10_000);
        try {
            const result = await solverSolve(opts.caseId, opts.monthYear, {
                unit: opts.caseId,
                start: opts.start,
                end: opts.end,
                timeout,
            });
            if (!result.success) {
                toast.error(result.error);
                return { succeeded: false };
            }
            if (result.data.job.status === 'completed') {
                toast.success('Dienstplan erfolgreich erstellt');
                setImportDialogParams({
                    caseId: opts.caseId,
                    start: opts.start,
                    end: opts.end,
                    solutionType: 'wdefault',
                    solution: result.data.solution,     // ← neu
                });
                setShowImportDialog(true);
                return { succeeded: true };
            }
            toast.error('Fehler beim Erstellen des Dienstplans', { description: result.data.job.error ?? result.data.job.consoleOutput });
            return { succeeded: false };
        } finally {
            await finishExecution();
        }
    }

    async function executeSolveMultiple(opts: SolverExecOptions, timeout: number): Promise<SolverOperationResult> {
        startExecution(timeout * 3 * 1_000 + 20_000);
        try {
            const result = await solverSolveMultiple(opts.caseId, opts.monthYear, {
                unit: opts.caseId,
                start: opts.start,
                end: opts.end,
                timeout,
            });
            if (!result.success) {
                toast.error(result.error);
                return { succeeded: false };
            }
            if (result.data.job.status === 'completed') {
                const successCount = result.data.scheduleInfo.solutionsGenerated;
                const expectedCount = 3;
                if (successCount === expectedCount) {
                    toast.success(`${successCount} Dienstpläne erfolgreich erstellt`, {
                        description: 'Alle Lösungen können nun importiert werden',
                    });
                } else if (successCount > 0) {
                    toast.warning(`Nur ${successCount} von ${expectedCount} Dienstplänen erstellt`, {
                        description: 'Einige Lösungen konnten nicht generiert werden (kein FEASIBLE Status)',
                    });
                } else {
                    toast.error('Keine Dienstpläne erstellt', {
                        description: 'Der Solver konnte keine FEASIBLE Lösungen finden',
                    });
                }
                if (successCount > 0) {
                    setMultipleImportDialogParams({
                        caseId: opts.caseId,
                        start: opts.start,
                        end: opts.end,
                        solutionCount: successCount,
                        feasibleSolutions: result.data.scheduleInfo.feasibleSolutions,
                        solutions: result.data.solutions,   // ← neu
                    });
                    setShowMultipleImportDialog(true);
                }
                return { succeeded: successCount > 0 };
            }
            toast.error('Fehler beim Erstellen mehrerer Dienstpläne', { description: result.data.job.error ?? result.data.job.consoleOutput });
            return { succeeded: false };
        } finally {
            await finishExecution();
        }
    }

    async function executeInsert(opts: SolverExecOptions): Promise<SolverOperationResult> {
        startExecution(60_000);
        try {
            const result = await solverInsert(opts.caseId, opts.monthYear, {
                unit: opts.caseId,
                start: opts.start,
                end: opts.end,
            });
            if (!result.success) {
                toast.error(result.error);
                return { succeeded: false };
            }
            if (result.data.job.status === 'completed') {
                toast.success('Daten erfolgreich in die Datenbank eingefügt');
                return { succeeded: true };
            }
            toast.error('Fehler beim Einfügen der Daten', { description: result.data.job.error ?? result.data.job.consoleOutput });
            return { succeeded: false };
        } finally {
            await finishExecution();
        }
    }

    async function executeDelete(opts: SolverExecOptions): Promise<SolverOperationResult> {
        startExecution(60_000);
        try {
            const result = await solverDelete(opts.caseId, opts.monthYear, {
                unit: opts.caseId,
                start: opts.start,
                end: opts.end,
            });
            if (!result.success) {
                toast.error(result.error);
                return { succeeded: false };
            }
            if (result.data.job.status === 'completed') {
                toast.success('Daten erfolgreich aus der Datenbank gelöscht');
                return { succeeded: true };
            }
            toast.error('Fehler beim Löschen der Daten', { description: result.data.job.error ?? result.data.job.consoleOutput });
            return { succeeded: false };
        } finally {
            await finishExecution();
        }
    }

    async function handleImport(
        caseId: number,
        monthYear: string,
        params: { start: string; end: string; solutionType: string; solution: ScheduleSolutionRaw },  // ← solution neu
    ): Promise<void> {
        setIsImporting(true);
        try {
            const result = await importSolution(caseId, monthYear, params);
            if (!result.success) {
                toast.error(result.error);
            } else {
                toast.success('Lösung erfolgreich importiert');
            }
        } finally {
            setIsImporting(false);
        }
    }

    return {
        isExecuting,
        isImporting,
        progress,
        executionStartTime,
        showImportDialog,
        setShowImportDialog,
        importDialogParams,
        showMultipleImportDialog,
        setShowMultipleImportDialog,
        multipleImportDialogParams,
        executeFetch,
        executeSolve,
        executeSolveMultiple,
        executeInsert,
        executeDelete,
        handleImport,
    };
}
