'use client';

import {useState} from 'react';
import {useCase} from '@/components/case-provider';
import {
    useFetch,
    useSolve,
    useSolveMultiple,
    useInsert,
    useDelete,
    useProcessSolution,
} from '@/features/solver/hooks/use-solver';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Loader2, Database, Play, Trash2, Upload, ChevronDownIcon} from 'lucide-react';
import {SolverCommandType} from '@/types/solver';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";

// Commands that don't require date range
const COMMANDS_WITHOUT_DATE: SolverCommandType[] = ['process-solution'];

export function SolverControlPanel() {
    const {currentCaseId: selectedCase} = useCase();
    const [command, setCommand] = useState<SolverCommandType>('solve');
    const [endDate, setEndDate] = useState('');
    const [timeout, setTimeout] = useState('300');
    const [maxSolutions, setMaxSolutions] = useState('5');
    const [filename, setFilename] = useState('');
    const [output, setOutput] = useState('processed_solution.json');

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [openDateRange, setOpenDateRange] = useState(false)

    const [startDate, setStartDate] = useState('');

    const fetchMutation = useFetch();
    const solveMutation = useSolve();
    const solveMultipleMutation = useSolveMultiple();
    const insertMutation = useInsert();
    const deleteMutation = useDelete();
    const processSolutionMutation = useProcessSolution();

    const isExecuting =
        fetchMutation.isPending ||
        solveMutation.isPending ||
        solveMultipleMutation.isPending ||
        insertMutation.isPending ||
        deleteMutation.isPending ||
        processSolutionMutation.isPending;

    const handleExecute = () => {
        if (!selectedCase) {
            return;
        }

        const requiresDate = !COMMANDS_WITHOUT_DATE.includes(command);

        // Handle commands that don't require dates
        if (command === 'process-solution') {
            processSolutionMutation.mutate({
                case: selectedCase,
                filename: filename || undefined,
                output: output || 'processed_solution.json',
            });
            return;
        }

        // For all other commands, dates are required
        if (requiresDate && (!startDate || !endDate)) {
            return;
        }

        // Validate dates
        const start = dateRange ? dateRange.from! : new Date("");
        const end = dateRange ? dateRange.to! : new Date("");

        if (start >= end) {
            // TODO: Replace with better UI feedback
            alert('Das Startdatum muss vor dem Enddatum liegen');
            return;
        }

                // Get the date in the format YYYY-MM-DD, but beware that we need to ensure the timezone is consistent to avoid off-by-one errors.ne

        const baseParams = {
            unit: selectedCase,
            start: start.getFullYear() + "-" + String(start.getMonth() + 1).padStart(2, '0') + "-" + String(start.getDate()).padStart(2, '0'),
            end: end.getFullYear() + "-" + String(end.getMonth() + 1).padStart(2, '0') + "-" + String(end.getDate()).padStart(2, '0'),
        };

        switch (command) {
            case 'fetch':
                fetchMutation.mutate(baseParams);
                break;
            case 'solve':
                solveMutation.mutate({
                    ...baseParams,
                    timeout: parseInt(timeout, 10),
                });
                break;
            case 'solve-multiple':
                solveMultipleMutation.mutate({
                    ...baseParams,
                    maxSolutions: parseInt(maxSolutions, 10),
                    timeout: parseInt(timeout, 10),
                });
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
            case 'process-solution':
                return 'Verarbeitet und exportiert eine Lösung als JSON';
            default:
                return '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solver steuern</CardTitle>
                <CardDescription>
                    {selectedCase
                        ? `Ausgewählter Fall: ${selectedCase}`
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
                            <SelectItem value="process-solution">
                                <div className="flex items-center gap-2">
                                    <Play className="h-4 w-4"/>
                                    <span>Lösung verarbeiten (process-solution)</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">{getCommandDescription(command)}</p>
                </div>

                {/* Date Range TODO: default should be the case month */}
                {!COMMANDS_WITHOUT_DATE.includes(command) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Datum</Label>
                            <Popover open={openDateRange} onOpenChange={setOpenDateRange}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-48 justify-between font-normal"
                                    >
                                        {dateRange ? (dateRange!.from!.toLocaleDateString() + " - " + dateRange!.to!.toLocaleDateString()) : "Select date"}
                                        <ChevronDownIcon/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        defaultMonth={dateRange?.from || new Date()}
                                        selected={dateRange}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDateRange(date);
                                            setStartDate(date?.from ? date.from.toISOString().split('T')[0] : '');
                                            setEndDate(date?.to ? date.to.toISOString().split('T')[0] : '');
                                        }}
                                    />
                                    <Button className="w-full rounded-t-none" onClick={() => setOpenDateRange(false)}>
                                        Datum auswählen
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}

                {/* Command-specific parameters for process-solution */}
                {command === 'process-solution' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="filename">Solution Filename (optional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="filename"
                                    type="text"
                                    placeholder="z.B. solution_1_2024-11-01-2024-11-30_0"
                                    value={filename}
                                    onChange={(e) => {
                                        setFilename(e.target.value);
                                        setOutput(`processed_${e.target.value || 'solution'}.json`)
                                    }}
                                    disabled={isExecuting}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.json';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                                // Remove .json extension from filename
                                                const nameWithoutExtension = file.name.replace(/\.json$/, '');
                                                setFilename(nameWithoutExtension);
                                                setOutput(`processed_${nameWithoutExtension || 'solution'}.json`)
                                            }
                                        };
                                        input.click();
                                    }}
                                    disabled={isExecuting}
                                >
                                    Durchsuchen
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Leer lassen für automatische Auswahl der neuesten Lösung
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="output">Output Filename</Label>
                            <Input
                                id="output"
                                type="text"
                                placeholder="processed_solution.json"
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                disabled={isExecuting}
                            />
                        </div>
                    </div>
                )}

                {/* Command-specific parameters */}
                {(command === 'solve' || command === 'solve-multiple') && (
                    <div className="grid grid-cols-2 gap-4">
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
                        {command === 'solve-multiple' && (
                            <div className="space-y-2">
                                <Label htmlFor="max-solutions">Max. Lösungen</Label>
                                <Input
                                    id="max-solutions"
                                    type="number"
                                    min="1"
                                    value={maxSolutions}
                                    onChange={(e) => setMaxSolutions(e.target.value)}
                                    disabled={isExecuting}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Execute Button */}
                <Button
                    onClick={handleExecute}
                    disabled={
                        !selectedCase ||
                        (!COMMANDS_WITHOUT_DATE.includes(command) && (!startDate || !endDate)) ||
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
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-center text-muted-foreground">
                            Der Befehl wird ausgeführt. Dies kann je nach Komplexität einige Minuten dauern...
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
