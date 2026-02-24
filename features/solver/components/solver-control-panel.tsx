'use client';

import React, {useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {parseMonthYear} from '@/lib/utils/case-utils';
import {
    useDelete,
    useFetch,
    useImportSolution,
    useInsert,
    useSolve,
    useSolveMultiple,
} from '@/features/solver/hooks/use-solver';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Progress} from '@/components/ui/progress';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Database, Loader2, Play, Trash2, Upload} from 'lucide-react';
import {SolverCommandType} from '@/src/entities/models/solver.model';
import {ImportSolutionDialog} from '@/components/import-solution-dialog';
import {ImportMultipleSolutionsDialog} from '@/components/import-multiple-solutions-dialog';

// Commands that don't require date range
const COMMANDS_WITHOUT_DATE: SolverCommandType[] = [];

export function SolverControlPanel() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const caseIdStr = searchParams.get('caseId');
    const monthYear = searchParams.get('monthYear') ?? '';
    const caseId = caseIdStr ? parseInt(caseIdStr, 10) : 0;
    const [command, setCommand] = useState<SolverCommandType>('solve');
    const [timeout, setTimeout] = useState('300');

    // Month and year state
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // Progress tracking
    const [progress, setProgress] = useState(0);
    const [executionStartTime, setExecutionStartTime] = useState<number | null>(null);

    // Set default month and year from URL params
    React.useEffect(() => {
        if (caseId && monthYear && selectedMonth === null && selectedYear === null) {
            const {month, year} = parseMonthYear(monthYear);
            setSelectedMonth(month);
            setSelectedYear(year);
        }
    }, [caseId, monthYear, selectedMonth, selectedYear]);

    // Import dialog state
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importParams, setImportParams] = useState<{
        caseId: number;
        start: string;
        end: string;
        solutionType: string;
    } | null>(null);

    // Multiple import dialog state
    const [showMultipleImportDialog, setShowMultipleImportDialog] = useState(false);
    const [multipleImportParams, setMultipleImportParams] = useState<{
        caseId: number;
        start: string;
        end: string;
        solutionCount: number;
        feasibleSolutions?: number[];
    } | null>(null);

    const fetchMutation = useFetch(caseId, monthYear);
    const solveMutation = useSolve(caseId, monthYear);
    const solveMultipleMutation = useSolveMultiple(caseId, monthYear);
    const insertMutation = useInsert(caseId, monthYear);
    const deleteMutation = useDelete(caseId, monthYear);
    const importSolutionMutation = useImportSolution(caseId, monthYear);

    const isExecuting =
        fetchMutation.isPending ||
        solveMutation.isPending ||
        solveMultipleMutation.isPending ||
        insertMutation.isPending ||
        deleteMutation.isPending;

    // Update progress based on elapsed time vs timeout
    React.useEffect(() => {
        if (!isExecuting || !executionStartTime) {
            setProgress(0);
            return;
        }

        // Calculate timeout: solve-multiple runs 3 times, so multiply by 3
        let currentTimeout = 60000; // Default 60s for other commands
        if (command === 'solve') {
            currentTimeout = parseInt(timeout, 10) * 1000 + 10000; // timeout + 10s buffer
        } else if (command === 'solve-multiple') {
            currentTimeout = parseInt(timeout, 10) * 3 * 1000 + 20000; // 3x timeout for 3 runs + 20s buffer
        }

        const interval = setInterval(() => {
            const elapsed = Date.now() - executionStartTime;
            const calculatedProgress = Math.min((elapsed / currentTimeout) * 100, 99);
            setProgress(calculatedProgress);
        }, 100); // Update every 100ms for smooth animation

        return () => clearInterval(interval);
    }, [isExecuting, executionStartTime, timeout, command]);

    // Reset progress when execution completes
    React.useEffect(() => {
        if (!isExecuting) {
            setProgress(0);
            setExecutionStartTime(null);
        }
    }, [isExecuting]);

    const handleExecute = () => {
        if (!caseId) {
            return;
        }

        // Track execution start time for progress
        setExecutionStartTime(Date.now());
        setProgress(0);

        const requiresDate = !COMMANDS_WITHOUT_DATE.includes(command);

        // For all other commands, dates are required
        if (requiresDate && (selectedMonth === null || selectedYear === null)) {
            return;
        }

        // Calculate first and last day of selected month
        const firstDay = new Date(selectedYear!, selectedMonth! - 1, 1);
        const lastDay = new Date(selectedYear!, selectedMonth!, 0);

        const baseParams = {
            unit: caseId,
            start: firstDay.getFullYear() + "-" + String(firstDay.getMonth() + 1).padStart(2, '0') + "-" + String(firstDay.getDate()).padStart(2, '0'),
            end: lastDay.getFullYear() + "-" + String(lastDay.getMonth() + 1).padStart(2, '0') + "-" + String(lastDay.getDate()).padStart(2, '0'),
        };

        switch (command) {
            case 'fetch':
                fetchMutation.mutate(baseParams, {
                    onSuccess: async () => {
                        // Update URL with new monthYear after successful fetch
                        if (selectedMonth !== null && selectedYear !== null) {
                            const monthStr = String(selectedMonth).padStart(2, '0');
                            const newMonthYear = `${monthStr}_${selectedYear}`;
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('caseId', String(caseId));
                            params.set('monthYear', newMonthYear);
                            router.push(`${pathname}?${params.toString()}`);
                        }
                    }
                });
                break;
            case 'solve':
                solveMutation.mutate(
                    {
                        ...baseParams,
                        timeout: parseInt(timeout, 10),
                    },
                    {
                        onSuccess: (data) => {
                            if (data.job.status === 'completed') {
                                // Show import dialog after successful solve
                                setImportParams({
                                    caseId: caseId,
                                    start: baseParams.start,
                                    end: baseParams.end,
                                    solutionType: 'wdefault',
                                });
                                setShowImportDialog(true);
                            }
                        },
                    }
                );
                break;
            case 'solve-multiple':
                solveMultipleMutation.mutate(
                    {
                        ...baseParams,
                        timeout: parseInt(timeout, 10),
                    },
                    {
                        onSuccess: (data) => {
                            if (data.job.status === 'completed') {
                                // Show multiple import dialog
                                setMultipleImportParams({
                                    caseId: caseId,
                                    start: baseParams.start,
                                    end: baseParams.end,
                                    solutionCount: data.scheduleInfo.solutionsGenerated || 3,
                                    feasibleSolutions: data.scheduleInfo.feasibleSolutions,
                                });
                                setShowMultipleImportDialog(true);
                            }
                        },
                    }
                );
                break;
            case 'insert':
                insertMutation.mutate(baseParams);
                break;
            case 'delete':
                if (confirm('Möchten Sie wirklich alle Daten für diesen Zeitraum löschen?')) {
                    deleteMutation.mutate(baseParams);
                }
                break;
        }
    };

    const getCommandIcon = (cmd: SolverCommandType) => {
        switch (cmd) {
            case 'fetch':
                return <Database className="h-4 w-4"/>;
            case 'solve':
            case 'solve-multiple':
                return <Play className="h-4 w-4"/>;
            case 'insert':
                return <Upload className="h-4 w-4"/>;
            case 'delete':
                return <Trash2 className="h-4 w-4"/>;
            default:
                return <Play className="h-4 w-4"/>;
        }
    };

    const getCommandDescription = (cmd: SolverCommandType) => {
        switch (cmd) {
            case 'fetch':
                return 'Ruft Daten aus der Datenbank ab und schreibt JSON-Dateien';
            case 'solve':
                return 'Löst das Planungsproblem für eine einzelne Lösung';
            case 'solve-multiple':
                return 'Generiert mehrere Lösungen für das Planungsproblem';
            case 'insert':
                return 'Fügt Daten aus JSON-Dateien in die Datenbank ein';
            case 'delete':
                return 'Löscht Daten aus der Datenbank (Reset)';
            default:
                return '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solver steuern</CardTitle>
                <CardDescription>
                    {caseId
                        ? `Ausgewählter Fall: ${caseId}`
                        : 'Bitte wählen Sie einen Fall aus'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Command Selection */}
                <div className="space-y-2">
                    <Label htmlFor="command">Befehl</Label>
                    <Select value={command} onValueChange={(v) => setCommand(v as SolverCommandType)}>
                        <SelectTrigger id="command">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fetch">
                                <div className="flex items-center gap-2">
                                    <Database className="h-4 w-4"/>
                                    <span>Daten abrufen (fetch)</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="solve">
                                <div className="flex items-center gap-2">
                                    <Play className="h-4 w-4"/>
                                    <span>Lösen (solve)</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="solve-multiple">
                                <div className="flex items-center gap-2">
                                    <Play className="h-4 w-4"/>
                                    <span>Mehrfach lösen (solve-multiple)</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="insert">
                                <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4"/>
                                    <span>Einfügen (insert)</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="delete">
                                <div className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4"/>
                                    <span>Löschen (delete)</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">{getCommandDescription(command)}</p>
                </div>

                {/* Month and Year Selection */}
                {!COMMANDS_WITHOUT_DATE.includes(command) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="month">Monat</Label>
                            <Select
                                value={selectedMonth?.toString() || ''}
                                onValueChange={(v) => setSelectedMonth(parseInt(v))}
                            >
                                <SelectTrigger id="month">
                                    <SelectValue placeholder="Monat wählen"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Januar</SelectItem>
                                    <SelectItem value="2">Februar</SelectItem>
                                    <SelectItem value="3">März</SelectItem>
                                    <SelectItem value="4">April</SelectItem>
                                    <SelectItem value="5">Mai</SelectItem>
                                    <SelectItem value="6">Juni</SelectItem>
                                    <SelectItem value="7">Juli</SelectItem>
                                    <SelectItem value="8">August</SelectItem>
                                    <SelectItem value="9">September</SelectItem>
                                    <SelectItem value="10">Oktober</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">Dezember</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Jahr</Label>
                            <Select
                                value={selectedYear?.toString() || ''}
                                onValueChange={(v) => setSelectedYear(parseInt(v))}
                            >
                                <SelectTrigger id="year">
                                    <SelectValue placeholder="Jahr wählen"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: 15}, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Command-specific parameters */}
                {(command === 'solve' || command === 'solve-multiple') && (
                    <div className="space-y-2">
                        <Label htmlFor="timeout">Timeout (Sekunden)</Label>
                        <Input
                            id="timeout"
                            type="number"
                            min="1"
                            value={timeout}
                            onChange={(e) => setTimeout(e.target.value)}
                            disabled={isExecuting}
                        />
                    </div>
                )}

                {/* Execute Button */}
                <Button
                    onClick={handleExecute}
                    disabled={
                        !caseId ||
                        (!COMMANDS_WITHOUT_DATE.includes(command) && (selectedMonth === null || selectedYear === null)) ||
                        isExecuting
                    }
                    className="w-full"
                    size="lg"
                    variant={command === 'delete' ? 'destructive' : 'default'}
                >
                    {isExecuting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                            Wird ausgeführt...
                        </>
                    ) : (
                        <>
                            {getCommandIcon(command)}
                            <span className="ml-2">Ausführen</span>
                        </>
                    )}
                </Button>

                {isExecuting && (
                    <div className="p-4 bg-muted rounded-lg space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Fortschritt</span>
                                <span className="text-muted-foreground font-mono">
                                    {progress.toFixed(0)}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2"/>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            {command === 'solve' && `Geschätzte Laufzeit: ${timeout}s`}
                            {command === 'solve-multiple' && `Geschätzte Laufzeit: ${parseInt(timeout, 10) * 3}s (3× ${timeout}s)`}
                            {command !== 'solve' && command !== 'solve-multiple' && 'Der Befehl wird ausgeführt...'}
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            {executionStartTime && `Gestartet: ${new Date(executionStartTime).toLocaleTimeString('de-DE')}`}
                        </p>
                    </div>
                )}
            </CardContent>

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
        </Card>
    );
}
