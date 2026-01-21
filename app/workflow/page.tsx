'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
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
    Trash2,
    Download,
    Play,
    PlayCircle,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Calendar,
    FolderOpen,
    Edit,
    AlertTriangle,
    FileCheck
} from 'lucide-react';
import {toast} from 'sonner';
import {useWorkflow} from '@/contexts/workflow-context';
import {useCase} from '@/components/case-provider';
import {ImportSolutionDialog} from '@/components/import-solution-dialog';
import {ImportMultipleSolutionsDialog} from '@/components/import-multiple-solutions-dialog';
import {useImportSolution} from '@/features/solver/hooks/use-solver';
import {TimeoutConfigDialog} from '@/components/timeout-config-dialog';
import {JobHistoryTable} from '@/features/solver/components/job-history-table';
import {useQueryClient} from '@tanstack/react-query';

type WorkflowAction = 'delete' | 'fetch' | 'solve' | 'multi-solve' | 'insert' | 'edit-wishes';

interface ActionState {
    status: 'idle' | 'running' | 'success' | 'error';
    message?: string;
}

interface ConfigCheck {
    isValid: boolean;
    pythonExecutable?: string;
    staffSchedulingPath?: string;
}

export default function WorkflowPage() {
    const router = useRouter();
    const {workflowData, isLoading: workflowLoading} = useWorkflow();
    const {switchCase, currentCaseId} = useCase();
    const queryClient = useQueryClient();

    // Use workflow data from server environment
    const caseId = workflowData?.caseId;
    const startDate = workflowData?.startDate;
    const endDate = workflowData?.endDate;

    const [actionStates, setActionStates] = useState<Record<WorkflowAction, ActionState>>({
        delete: {status: 'idle'},
        fetch: {status: 'idle'},
        solve: {status: 'idle'},
        'multi-solve': {status: 'idle'},
        insert: {status: 'idle'},
        'edit-wishes': {status: 'idle'}
    });

    const [configCheck, setConfigCheck] = useState<ConfigCheck | null>(null);
    const [solutionExists, setSolutionExists] = useState<boolean | null>(null);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [showFetchWarning, setShowFetchWarning] = useState(false);

    // Import dialog state
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importParams, setImportParams] = useState<{
        caseId: number;
        start: string;
        end: string;
        solutionType: string;
    } | null>(null);
    const importSolutionMutation = useImportSolution();

    // Multiple import dialog state
    const [showMultipleImportDialog, setShowMultipleImportDialog] = useState(false);
    const [multipleImportParams, setMultipleImportParams] = useState<{
        caseId: number;
        start: string;
        end: string;
        solutionCount: number;
        feasibleSolutions?: number[];
    } | null>(null);

    // Timeout dialog state
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<'solve' | 'multi-solve' | null>(null);

    // Check configuration on mount
    useEffect(() => {
        const checkConfig = async () => {
            try {
                const response = await fetch('/api/solver/validate-config');
                const data = await response.json();
                setConfigCheck({
                    isValid: data.isValid,
                    pythonExecutable: data.pythonExecutable,
                    staffSchedulingPath: data.staffSchedulingPath
                });
            } catch (error) {
                setConfigCheck({isValid: false});
                toast.error('Konfiguration konnte nicht geladen werden');
            }
        };
        checkConfig();
    }, []);

    // Check if solution file exists for delete
    useEffect(() => {
        const checkSolutionFile = async () => {
            if (!caseId || !startDate || !endDate || !configCheck?.staffSchedulingPath) return;

            try {
                const isoStart = convertToISODate(startDate);
                const isoEnd = convertToISODate(endDate);
                const filename = `solution_${caseId}_${isoStart}-${isoEnd}.json`;

                const response = await fetch(`/api/solver/find-file?filename=${encodeURIComponent(filename)}`);
                const data = await response.json();
                setSolutionExists(data.exists);
            } catch (error) {
                setSolutionExists(false);
            }
        };
        checkSolutionFile();
    }, [caseId, startDate, endDate, configCheck]);

    // Redirect if no workflow data available or config invalid
    useEffect(() => {
        if (!workflowLoading && (!caseId || !startDate || !endDate)) {
            toast.error('Diese Seite ist nur im Workflow-Modus verfügbar. Starten Sie die Anwendung über TimeOffice.');
            router.push('/');
        }
        if (configCheck && !configCheck.isValid) {
            toast.error('Konfiguration ist ungültig. Bitte konfigurieren Sie das StaffScheduling-Projekt und die Python-Executable.');
        }
    }, [caseId, startDate, endDate, router, workflowLoading, configCheck]);

    const formatDate = (dateStr: string | null): string => {
        if (!dateStr) return '';
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            return `${parts[0]}.${parts[1]}.${parts[2]}`;
        }
        return dateStr;
    };

    // 01.11.2024 -> 11_2024 or 01.01.2024 -> 01_2024
    const getFolderName = (dateStr: string): string => {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            return `${parts[1]}_${parts[2]}`;
        }
        return dateStr;
    }

    const convertToISODate = (dateStr: string): string => {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
    };

    const executeAction = async (action: WorkflowAction) => {
        // Handle special actions
        if (action === 'edit-wishes') {
            await switchCase(parseInt(caseId!), getFolderName(startDate!));
            router.push('/wishes-and-blocked');
            return;
        }

        // Show warnings for delete and fetch
        if (action === 'delete' && !solutionExists) {
            setShowDeleteWarning(true);
            return;
        }
        if (action === 'fetch') {
            setShowFetchWarning(true);
            return;
        }

        // Show timeout dialog for solve and multi-solve
        if (action === 'solve' || action === 'multi-solve') {
            setPendingAction(action);
            setShowTimeoutDialog(true);
            return;
        }

        await executeAPIAction(action);
    };

    const executeAPIAction = async (action: WorkflowAction, timeout?: number) => {
        setActionStates(prev => ({...prev, [action]: {status: 'running'}}));

        try {
            const isoStart = convertToISODate(startDate!);
            const isoEnd = convertToISODate(endDate!);

            let endpoint = '';
            const body: {
                unit: number;
                start: string;
                end: string;
                timeout?: number;
            } = {
                unit: parseInt(caseId!),
                start: isoStart,
                end: isoEnd
            };

            switch (action) {
                case 'delete':
                    endpoint = '/api/solver/delete';
                    break;
                case 'fetch':
                    endpoint = '/api/solver/fetch';
                    break;
                case 'solve':
                    endpoint = '/api/solver/solve';
                    body.timeout = timeout || 60;
                    break;
                case 'multi-solve':
                    endpoint = '/api/solver/solve-multiple';
                    body.timeout = timeout || 60;
                    break;
                case 'insert':
                    // First, save the currently selected schedule before exporting
                    toast.info('Speichere ausgewählten Dienstplan vor dem Export...');

                    const saveSolutionResponse = await fetch('/api/solver/save-solution', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-case-id': caseId!
                        },
                        body: JSON.stringify({
                            start: isoStart,
                            end: isoEnd
                        })
                    });

                    if (!saveSolutionResponse.ok) {
                        const saveError = await saveSolutionResponse.json();
                        throw new Error(saveError.error || 'Fehler beim Speichern des Dienstplans vor dem Export');
                    }

                    const saveResult = await saveSolutionResponse.json();
                    console.log('Dienstplan gespeichert:', saveResult);
                    toast.success(`Dienstplan gespeichert als ${saveResult.filename}`);

                    endpoint = '/api/solver/insert';
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-case-id': caseId!
                },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            // Invalidate job history to refresh the table (even on errors to show failed jobs)
            queryClient.invalidateQueries({queryKey: ['solver', 'jobs', currentCaseId]});

            if (!response.ok) {
                // If the job failed but we have job details, extract more information
                if (result.job && result.job.status === 'failed') {
                    // Extract error details from console output if available
                    let errorDetail = 'Der Solver konnte keine FEASIBLE Lösung finden';

                    if (result.job.consoleOutput) {
                        // Try to extract meaningful error from console output
                        const outputLines = result.job.consoleOutput.split('\n');
                        const errorLines = outputLines.filter((line: string) =>
                            line.includes('ERROR') ||
                            line.includes('UNKNOWN') ||
                            line.includes('INFEASIBLE') ||
                            line.includes('status')
                        );

                        if (errorLines.length > 0) {
                            errorDetail = errorLines.slice(0, 3).join('\n');
                        }
                    }

                    throw new Error(errorDetail);
                }

                throw new Error(result.error || 'Fehler bei der Ausführung');
            }

            setActionStates(prev => ({
                ...prev,
                [action]: {
                    status: 'success',
                    message: result.message || 'Erfolgreich abgeschlossen'
                }
            }));

            // Handle successful solve - check if solution is FEASIBLE
            if (action === 'solve' && result.job) {
                if (result.job.status === 'completed') {
                    toast.success('Dienstplan erfolgreich berechnet');
                    setImportParams({
                        caseId: parseInt(caseId!),
                        start: isoStart,
                        end: isoEnd,
                        solutionType: 'wdefault',
                    });
                    setShowImportDialog(true);
                } else {
                    toast.error('Fehler beim Berechnen des Dienstplans', {
                        description: 'Der Solver konnte keine FEASIBLE Lösung finden',
                    });
                }
            }

            // Handle successful multi-solve - check how many solutions are FEASIBLE
            if (action === 'multi-solve' && result.job && result.scheduleInfo) {
                if (result.job.status === 'completed') {
                    const successCount = result.scheduleInfo.solutionsGenerated || 0;
                    const expectedCount = 3;

                    if (successCount === expectedCount) {
                        toast.success(
                            `${successCount} Dienstpläne erfolgreich berechnet`,
                            {
                                description: 'Alle Lösungen können nun importiert werden',
                            }
                        );
                    } else if (successCount > 0) {
                        toast.warning(
                            `Nur ${successCount} von ${expectedCount} Dienstplänen berechnet`,
                            {
                                description: 'Einige Lösungen konnten nicht generiert werden (kein FEASIBLE Status)',
                            }
                        );
                    } else {
                        toast.error('Keine Dienstpläne berechnet', {
                            description: 'Der Solver konnte keine FEASIBLE Lösungen finden',
                        });
                    }

                    // Show import dialog only if at least one solution was generated
                    if (successCount > 0) {
                        setMultipleImportParams({
                            caseId: parseInt(caseId!),
                            start: isoStart,
                            end: isoEnd,
                            solutionCount: successCount,
                            feasibleSolutions: result.scheduleInfo.feasibleSolutions,
                        });
                        setShowMultipleImportDialog(true);
                    }
                } else {
                    toast.error('Fehler beim Berechnen mehrerer Dienstpläne', {
                        description: 'Der Solver konnte den Vorgang nicht abschließen',
                    });
                }
            }

            // Show generic success toast for other actions
            if (action !== 'solve' && action !== 'multi-solve') {
                toast.success(`${getActionLabel(action)} erfolgreich abgeschlossen`);
            }

            // Refresh solution exists check after delete
            if (action === 'delete') {
                setSolutionExists(false);
            }
        } catch (error) {
            // Invalidate job history to show failed jobs
            queryClient.invalidateQueries({queryKey: ['solver', 'jobs', currentCaseId]});

            const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
            setActionStates(prev => ({
                ...prev,
                [action]: {
                    status: 'error',
                    message: errorMessage
                }
            }));

            // Show detailed error toast
            toast.error(`Fehler bei ${getActionLabel(action)}`, {
                description: errorMessage,
            });
        }
    };

    const handleTimeoutConfirm = async (timeout: number) => {
        if (!pendingAction) return;

        const action = pendingAction;
        setPendingAction(null);
        setShowTimeoutDialog(false);

        await executeAPIAction(action, timeout);
    };

    const getActionLabel = (action: WorkflowAction): string => {
        const labels: Record<WorkflowAction, string> = {
            delete: 'Dienstplan löschen',
            fetch: 'Daten holen',
            solve: 'Dienstplan berechnen',
            'multi-solve': 'Mehrere Dienstpläne berechnen',
            insert: 'Dienstplan exportieren',
            'edit-wishes': 'Wünsche bearbeiten'
        };
        return labels[action];
    };

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
            'edit-wishes': <Edit className="h-6 w-6"/>
        };
        return icons[action];
    };

    const getActionDescription = (action: WorkflowAction): string => {
        const descriptions: Record<WorkflowAction, string> = {
            delete: 'Löscht den hochgeladenen Dienstplan aus TimeOffice',
            fetch: 'Lädt aktuelle Mitarbeiter- und Wunschdaten aus TimeOffice',
            solve: 'Berechnet eine optimale Lösung für den Dienstplan',
            'multi-solve': 'Berechnet mehrere alternative Lösungen zur Auswahl',
            insert: 'Exportiert den ausgewählten Dienstplan zurück nach TimeOffice',
            'edit-wishes': 'Bearbeiten Sie Wünsche und Blockierungen der Mitarbeiter'
        };
        return descriptions[action];
    };

    const getActionButtonVariant = (action: WorkflowAction): "default" | "outline" | "secondary" => {
        const state = actionStates[action];
        if (state.status === 'success') return 'outline';
        return 'default';
    };

    const isActionDisabled = (action: WorkflowAction): boolean => {
        if (!configCheck?.isValid) return true;
        const state = actionStates[action];
        return state.status === 'running';
    };

    if (!caseId || !startDate || !endDate) {
        return null;
    }

    if (!configCheck) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                </div>
            </div>
        );
    }

    const actions: WorkflowAction[] = ['delete', 'fetch', 'edit-wishes', 'solve', 'multi-solve', 'insert'];

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dienstplan-Workflow</h1>
                <p className="text-muted-foreground">
                    Wählen Sie die gewünschten Aktionen aus
                </p>
            </div>

            {!configCheck.isValid && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Konfiguration ungültig</AlertTitle>
                    <AlertDescription>
                        Bitte konfigurieren Sie das StaffScheduling-Projekt und die Python-Executable in der
                        config.json.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5"/>
                        Planungseinheit & Zeitraum
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
                                        state.status === 'running' ? 'border-blue-200 bg-blue-50/50' :
                                            ''
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
                                    <Alert
                                        className={solutionExists ? "mb-4 border-green-200 bg-green-50" : "mb-4 border-amber-200 bg-amber-50"}>
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
                                    <Alert className="mb-4"
                                           variant={state.status === 'error' ? 'destructive' : 'default'}>
                                        <AlertDescription>{state.message}</AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    onClick={() => executeAction(action)}
                                    disabled={isActionDisabled(action)}
                                    variant={getActionButtonVariant(action)}
                                    className="w-full"
                                >
                                    {state.status === 'running' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    {state.status === 'success' ? 'Erneut ausführen' : 'Ausführen'}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Job History Table */}
            <div className="mt-8">
                <JobHistoryTable/>
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
                            executeAPIAction('delete');
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
                            executeAPIAction('fetch');
                        }}>
                            Fortfahren
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Import Solution Dialog */}
            {importParams && (
                <ImportSolutionDialog
                    open={showImportDialog}
                    onOpenChange={setShowImportDialog}
                    caseId={importParams.caseId}
                    start={importParams.start}
                    end={importParams.end}
                    solutionType={importParams.solutionType}
                    onImport={async (params) => {
                        await importSolutionMutation.mutateAsync(params);
                    }}
                    isImporting={importSolutionMutation.isPending}
                />
            )}

            {/* Import Multiple Solutions Dialog */}
            {multipleImportParams && (
                <ImportMultipleSolutionsDialog
                    open={showMultipleImportDialog}
                    onOpenChange={setShowMultipleImportDialog}
                    caseId={multipleImportParams.caseId}
                    start={multipleImportParams.start}
                    end={multipleImportParams.end}
                    solutionCount={multipleImportParams.solutionCount}
                    feasibleSolutions={multipleImportParams.feasibleSolutions}
                    onImport={async (params) => {
                        await importSolutionMutation.mutateAsync(params);
                    }}
                    isImporting={importSolutionMutation.isPending}
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
