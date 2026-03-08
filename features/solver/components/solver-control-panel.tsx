'use client';

import React, {useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {parseMonthYear} from '@/lib/utils/case-utils';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Progress} from '@/components/ui/progress';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {CheckCircle2, Database, Info, Loader2, Play, Trash2, Upload} from 'lucide-react';
import {SolverCommandType} from '@/src/entities/models/solver.model';
import {ImportSolutionDialog} from '@/components/import-solution-dialog';
import {ImportMultipleSolutionsDialog} from '@/components/import-multiple-solutions-dialog';
import {useSolverOperations} from '@/features/solver/hooks/use-solver-operations';

// Commands that don't require date range
const COMMANDS_WITHOUT_DATE: SolverCommandType[] = [];

interface SolverControlPanelProps {
    caseId: number;
    monthYear: string;
    onAfterOperation?: () => Promise<void>;
    initialLastInsertedSolution?: import('@/src/entities/models/schedule.model').ScheduleSolutionRaw | null;
    initialPendingInsertSolution?: import('@/src/entities/models/schedule.model').ScheduleSolutionRaw | null;
    isLocked?: boolean;
}

export function SolverControlPanel({caseId, monthYear, onAfterOperation, initialLastInsertedSolution, initialPendingInsertSolution, isLocked}: SolverControlPanelProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [command, setCommand] = useState<SolverCommandType>('solve');
    const [timeout, setTimeout] = useState('300');

    // Month and year state
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // Set default month and year from URL params
    React.useEffect(() => {
        if (caseId && monthYear && selectedMonth === null && selectedYear === null) {
            const {month, year} = parseMonthYear(monthYear);
            setSelectedMonth(month);
            setSelectedYear(year);
        }
    }, [caseId, monthYear, selectedMonth, selectedYear]);

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
        pendingInsertSolution,
        lastInsertedSolution,
    } = useSolverOperations({onAfterOperation, initialLastInsertedSolution: initialLastInsertedSolution ?? null, initialPendingInsertSolution: initialPendingInsertSolution ?? null});

    const handleExecute = async () => {
        if (!caseId) return;

        const requiresDate = !COMMANDS_WITHOUT_DATE.includes(command);
        if (requiresDate && (selectedMonth === null || selectedYear === null)) return;

        // Calculate first and last day of selected month
        const firstDay = new Date(selectedYear!, selectedMonth! - 1, 1);
        const lastDay = new Date(selectedYear!, selectedMonth!, 0);

        const start =
            firstDay.getFullYear() + '-' +
            String(firstDay.getMonth() + 1).padStart(2, '0') + '-' +
            String(firstDay.getDate()).padStart(2, '0');
        const end =
            lastDay.getFullYear() + '-' +
            String(lastDay.getMonth() + 1).padStart(2, '0') + '-' +
            String(lastDay.getDate()).padStart(2, '0');

        const execOpts = {caseId, monthYear, start, end};

        switch (command) {
            case 'fetch': {
                const result = await executeFetch(execOpts);
                if (result.succeeded && selectedMonth !== null && selectedYear !== null) {
                    const monthStr = String(selectedMonth).padStart(2, '0');
                    const newMonthYear = `${monthStr}_${selectedYear}`;
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('caseId', String(caseId));
                    params.set('monthYear', newMonthYear);
                    router.push(`${pathname}?${params.toString()}`);
                }
                break;
            }
            case 'solve':
                await executeSolve(execOpts, parseInt(timeout, 10));
                break;
            case 'solve-multiple':
                await executeSolveMultiple(execOpts, parseInt(timeout, 10));
                break;
            case 'insert':
                await executeInsert(execOpts);
                break;
            case 'delete': {
                if (!confirm('Möchten Sie wirklich alle Daten für diesen Zeitraum löschen?')) return;
                await executeDelete(execOpts);
                break;
            }
        }
    };

    const getCommandIcon = (cmd: SolverCommandType) => {
        switch (cmd) {
            case 'fetch': return <Database className="h-4 w-4"/>;
            case 'solve':
            case 'solve-multiple': return <Play className="h-4 w-4"/>;
            case 'insert': return <Upload className="h-4 w-4"/>;
            case 'delete': return <Trash2 className="h-4 w-4"/>;
            default: return <Play className="h-4 w-4"/>;
        }
    };

    const getCommandDescription = (cmd: SolverCommandType) => {
        switch (cmd) {
            case 'fetch': return 'Ruft Daten aus der Datenbank ab und schreibt JSON-Dateien';
            case 'solve': return 'Löst das Planungsproblem für eine einzelne Lösung';
            case 'solve-multiple': return 'Generiert mehrere Lösungen für das Planungsproblem';
            case 'insert': return 'Fügt Daten aus JSON-Dateien in die Datenbank ein';
            case 'delete': return 'Löscht Daten aus der Datenbank (Reset)';
            default: return '';
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
                    {command === 'insert' && (
                        <div className={`flex items-center gap-1.5 text-xs mt-1 ${pendingInsertSolution ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {pendingInsertSolution
                                ? <><CheckCircle2 className="h-3.5 w-3.5"/>Lösung bereit für Einspielung</>
                                : <><Info className="h-3.5 w-3.5"/>Keine Lösung im Speicher – API liest von Disk (nur CLI)</>
                            }
                        </div>
                    )}
                    {command === 'delete' && (
                        <div className={`flex items-center gap-1.5 text-xs mt-1 ${lastInsertedSolution ? 'text-amber-600' : 'text-muted-foreground'}`}>
                            {lastInsertedSolution
                                ? <><CheckCircle2 className="h-3.5 w-3.5"/>Letzte eingespielten Lösung vorhanden – wird direkt übergeben</>
                                : <><Info className="h-3.5 w-3.5"/>Keine eingespielnte Lösung im Speicher – API/CLI liest von Disk</>
                            }
                        </div>
                    )}
                </div>

                {/* Month and Year Selection */}
                {!COMMANDS_WITHOUT_DATE.includes(command) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="month">Monat</Label>
                            <Select
                                value={selectedMonth?.toString() || ''}
                                onValueChange={(v) => setSelectedMonth(parseInt(v))}
                                disabled={isLocked}
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
                                disabled={isLocked}
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
                            {command === 'solve-multiple' && `Geschätzte Laufzeit: ${parseInt(timeout, 10) * 3}s (3x ${timeout}s)`}
                            {command !== 'solve' && command !== 'solve-multiple' && 'Der Befehl wird ausgeführt...'}
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Import Solution Dialog */}
            {importDialogParams && (
                <ImportSolutionDialog
                    open={showImportDialog}
                    onOpenChange={setShowImportDialog}
                    caseId={importDialogParams.caseId}
                    start={importDialogParams.start}
                    end={importDialogParams.end}
                    solutionType={importDialogParams.solutionType}
                    onImport={(params) => handleImport(caseId, monthYear, {
                        ...params,
                        solution: importDialogParams.solution,  // ← solution aus params
                    })}
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
                    onImport={(params) => handleImport(caseId, monthYear, {
                        ...params,
                        solution: multipleImportDialogParams.solutions[params.solutionIndex ?? 0],  // ← richtige Solution anhand Index
                    })}
                    isImporting={isImporting}
                />
            )}
        </Card>
    );
}
