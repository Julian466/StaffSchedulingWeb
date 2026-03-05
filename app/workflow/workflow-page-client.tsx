'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Progress} from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Download,
    Edit,
    FileCheck,
    FolderOpen,
    Loader2,
    Play,
    PlayCircle,
    Trash2,
    Upload,
} from 'lucide-react';
import {ImportSolutionDialog} from '@/components/import-solution-dialog';
import {ImportMultipleSolutionsDialog} from '@/components/import-multiple-solutions-dialog';
import {TimeoutConfigDialog} from '@/components/timeout-config-dialog';
import {JobHistoryTable} from '@/features/solver/components/job-history-table';
import {findSolutionFile, getJobs} from '@/features/solver/solver.actions';
import {useSolverOperations} from '@/features/solver/hooks/use-solver-operations';
import type {SolverConfigResult, SolverJob} from '@/src/entities/models/solver.model';

type WorkflowAction = 'delete' | 'fetch' | 'solve' | 'multi-solve' | 'insert' | 'edit-wishes';

interface ActionState {
    status: 'idle' | 'running' | 'success' | 'error';
    message?: string;
}

interface WorkflowPageClientProps {
    caseId: number;
    monthYear: string;
    startDate: string;
    endDate: string;
    isoStart: string;
    isoEnd: string;
    initialConfig: SolverConfigResult | null;
    initialJobs: SolverJob[];
}

export function WorkflowPageClient({
    caseId,
    monthYear,
    startDate,
    endDate,
    isoStart,
    isoEnd,
    initialConfig,
    initialJobs,
}: WorkflowPageClientProps) {
    const router = useRouter();
    const [jobs, setJobs] = useState<SolverJob[]>(initialJobs);
    const [solutionExists, setSolutionExists] = useState<boolean | null>(null);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [showFetchWarning, setShowFetchWarning] = useState(false);
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<'solve' | 'multi-solve' | null>(null);
    const [actionStates, setActionStates] = useState<Record<WorkflowAction, ActionState>>({
        delete: {status: 'idle'},
        fetch: {status: 'idle'},
        solve: {status: 'idle'},
        'multi-solve': {status: 'idle'},
        insert: {status: 'idle'},
        'edit-wishes': {status: 'idle'},
    });

    const refreshJobs = async () => {
        try {
            const data = await getJobs(caseId, monthYear);
            setJobs(data.jobs);
        } catch {
            // silently fail
        }
    };

    const {
        isExecuting,
        isImporting,
        progress,
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
    } = useSolverOperations({onAfterOperation: refreshJobs});

    // Check if solution file exists for delete button indicator
    useEffect(() => {
        if (!initialConfig?.staffSchedulingPath) return;
        const filename = `solution_${caseId}_${isoStart}-${isoEnd}.json`;
        findSolutionFile(filename)
            .then((result) => setSolutionExists(result.success ? result.data.exists : false))
            .catch(() => setSolutionExists(false));
    }, [caseId, isoStart, isoEnd, initialConfig]);

    const execOpts = {caseId, monthYear, start: isoStart, end: isoEnd};

    const runAction = async (action: WorkflowAction, timeout?: number) => {
        setActionStates(prev => ({...prev, [action]: {status: 'running'}}));
        let succeeded = false;
        try {
            switch (action) {
                case 'delete': {
                    const r = await executeDelete(execOpts);
                    succeeded = r.succeeded;
                    if (succeeded) setSolutionExists(false);
                    break;
                }
                case 'fetch': {
                    const r = await executeFetch(execOpts);
                    succeeded = r.succeeded;
                    break;
                }
                case 'solve': {
                    const r = await executeSolve(execOpts, timeout ?? 60);
                    succeeded = r.succeeded;
                    break;
                }
                case 'multi-solve': {
                    const r = await executeSolveMultiple(execOpts, timeout ?? 60);
                    succeeded = r.succeeded;
                    break;
                }
                case 'insert': {
                    const r = await executeInsert(execOpts, true);
                    succeeded = r.succeeded;
                    break;
                }
            }
            setActionStates(prev => ({
                ...prev,
                [action]: {status: succeeded ? 'success' : 'error'},
            }));
        } catch {
            setActionStates(prev => ({...prev, [action]: {status: 'error'}}));
        }
    };

    const executeAction = (action: WorkflowAction) => {
        if (action === 'edit-wishes') {
            router.push(`/wishes-and-blocked?caseId=${caseId}&monthYear=${monthYear}`);
            return;
        }
        if (action === 'delete' && !solutionExists) {
            setShowDeleteWarning(true);
            return;
        }
        if (action === 'fetch') {
            setShowFetchWarning(true);
            return;
        }
        if (action === 'solve' || action === 'multi-solve') {
            setPendingAction(action);
            setShowTimeoutDialog(true);
            return;
        }
        runAction(action);
    };

    const handleTimeoutConfirm = (timeout: number) => {
        if (!pendingAction) return;
        const action = pendingAction;
        setPendingAction(null);
        setShowTimeoutDialog(false);
        runAction(action, timeout);
    };

    const formatDate = (dateStr: string): string => dateStr;

    const getActionLabel = (action: WorkflowAction): string => ({
        delete: 'Dienstplan löschen',
        fetch: 'Daten holen',
        solve: 'Dienstplan berechnen',
        'multi-solve': 'Mehrere Dienstpläne berechnen',
        insert: 'Dienstplan exportieren',
        'edit-wishes': 'Wünsche bearbeiten',
    }[action]);

    const getActionDescription = (action: WorkflowAction): string => ({
        delete: 'Löscht den hochgeladenen Dienstplan aus TimeOffice',
        fetch: 'Lädt aktuelle Mitarbeiter- und Wunschdaten aus TimeOffice',
        solve: 'Berechnet eine optimale Lösung für den Dienstplan',
        'multi-solve': 'Berechnet mehrere alternative Lösungen zur Auswahl',
        insert: 'Exportiert den ausgewählten Dienstplan zurück nach TimeOffice',
        'edit-wishes': 'Bearbeiten Sie Wünsche und Blockierungen der Mitarbeiter',
    }[action]);

    const getActionIcon = (action: WorkflowAction) => {
        const state = actionStates[action];
        if (state.status === 'running') return <Loader2 className="h-6 w-6 animate-spin"/>;
        if (state.status === 'success') return <CheckCircle2 className="h-6 w-6 text-green-600"/>;
        if (state.status === 'error') return <AlertCircle className="h-6 w-6 text-red-600"/>;
        const icons: Record<WorkflowAction, React.ReactElement> = {
            delete: <Trash2 className="h-6 w-6"/>,
            fetch: <Download className="h-6 w-6"/>,
            solve: <Play className="h-6 w-6"/>,
            'multi-solve': <PlayCircle className="h-6 w-6"/>,
            insert: <Upload className="h-6 w-6"/>,
            'edit-wishes': <Edit className="h-6 w-6"/>,
        };
        return icons[action];
    };

    const getActionButtonVariant = (action: WorkflowAction): 'default' | 'outline' | 'secondary' =>
        actionStates[action].status === 'success' ? 'outline' : 'default';

    const isActionDisabled = (action: WorkflowAction): boolean => {
        if (!initialConfig?.isValid) return true;
        return actionStates[action].status === 'running' || isExecuting;
    };

    const actions: WorkflowAction[] = ['delete', 'fetch', 'edit-wishes', 'solve', 'multi-solve', 'insert'];

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dienstplan-Workflow</h1>
                <p className="text-muted-foreground">Wählen Sie die gewünschten Aktionen aus</p>
            </div>

            {initialConfig && !initialConfig.isValid && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Konfiguration ungültig</AlertTitle>
                    <AlertDescription>
                        Bitte konfigurieren Sie das StaffScheduling-Projekt und die Python-Executable in der config.json.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5"/>
                        Planungseinheit &amp; Zeitraum
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Planungseinheit</p>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                Case {caseId}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Von</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <span className="font-medium">{formatDate(startDate)}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Bis</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <span className="font-medium">{formatDate(endDate)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Progress bar — shown during any solver operation */}
            {isExecuting && (
                <div className="mb-6 p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fortschritt</span>
                        <span className="text-muted-foreground font-mono">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2"/>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action) => {
                    const state = actionStates[action];
                    const isDelete = action === 'delete';

                    return (
                        <Card
                            key={action}
                            className={
                                state.status === 'success' ? 'border-green-200 bg-green-50/50' :
                                state.status === 'error' ? 'border-red-200 bg-red-50/50' :
                                state.status === 'running' ? 'border-blue-200 bg-blue-50/50' : ''
                            }
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {getActionIcon(action)}
                                            {getActionLabel(action)}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {getActionDescription(action)}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isDelete && solutionExists !== null && (
                                    <Alert className={solutionExists
                                        ? 'mb-4 border-green-200 bg-green-50'
                                        : 'mb-4 border-amber-200 bg-amber-50'}>
                                        {solutionExists ? (
                                            <>
                                                <FileCheck className="h-4 w-4 text-green-600"/>
                                                <AlertDescription className="text-green-800">
                                                    Dienstplan-Datei gefunden
                                                </AlertDescription>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-4 w-4 text-amber-600"/>
                                                <AlertDescription className="text-amber-800">
                                                    Keine Dienstplan-Datei gefunden. Bestätigung erforderlich.
                                                </AlertDescription>
                                            </>
                                        )}
                                    </Alert>
                                )}

                                {state.message && (
                                    <Alert className="mb-4" variant={state.status === 'error' ? 'destructive' : 'default'}>
                                        <AlertDescription>{state.message}</AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    onClick={() => executeAction(action)}
                                    disabled={isActionDisabled(action)}
                                    variant={getActionButtonVariant(action)}
                                    className="w-full"
                                >
                                    {state.status === 'running' && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    )}
                                    {state.status === 'success' ? 'Erneut ausführen' : 'Ausführen'}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Job History Table */}
            <div className="mt-8">
                <JobHistoryTable jobs={jobs}/>
            </div>

            {/* Delete Warning Dialog */}
            <AlertDialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600"/>
                            Keine Dienstplan-Datei gefunden
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Es wurde keine exportierte Dienstplan-Datei für Case {caseId} im
                            Zeitraum {formatDate(startDate)} bis {formatDate(endDate)} gefunden.
                            <br/><br/>
                            Möchten Sie trotzdem fortfahren und den Delete-Befehl ausführen?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setShowDeleteWarning(false);
                            runAction('delete');
                        }}>
                            Trotzdem ausführen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Fetch Warning Dialog */}
            <AlertDialog open={showFetchWarning} onOpenChange={setShowFetchWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600"/>
                            Wünsche werden überschrieben
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Beim Laden der Daten aus TimeOffice werden die aktuellen Wünsche und Blockierungen
                            überschrieben.
                            <br/><br/>
                            Stellen Sie sicher, dass Sie alle wichtigen Änderungen gespeichert haben.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setShowFetchWarning(false);
                            runAction('fetch');
                        }}>
                            Fortfahren
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Import Solution Dialog */}
            {importDialogParams && (
                <ImportSolutionDialog
                    open={showImportDialog}
                    onOpenChange={setShowImportDialog}
                    caseId={importDialogParams.caseId}
                    start={importDialogParams.start}
                    end={importDialogParams.end}
                    solutionType={importDialogParams.solutionType}
                    onImport={(params) => handleImport(caseId, monthYear, params)}
                    isImporting={isImporting}
                />
            )}

            {/* Import Multiple Solutions Dialog */}
            {multipleImportDialogParams && (
                <ImportMultipleSolutionsDialog
                    open={showMultipleImportDialog}
                    onOpenChange={setShowMultipleImportDialog}
                    caseId={multipleImportDialogParams.caseId}
                    start={multipleImportDialogParams.start}
                    end={multipleImportDialogParams.end}
                    solutionCount={multipleImportDialogParams.solutionCount}
                    feasibleSolutions={multipleImportDialogParams.feasibleSolutions}
                    onImport={(params) => handleImport(caseId, monthYear, params)}
                    isImporting={isImporting}
                />
            )}

            {/* Timeout Configuration Dialog */}
            <TimeoutConfigDialog
                open={showTimeoutDialog}
                onOpenChange={setShowTimeoutDialog}
                onConfirm={handleTimeoutConfirm}
                isExecuting={pendingAction ? actionStates[pendingAction].status === 'running' : false}
                actionTitle={pendingAction ? getActionLabel(pendingAction) : ''}
            />
        </div>
    );
}
