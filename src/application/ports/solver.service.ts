import type {
    DeleteParams,
    FetchParams,
    InsertParams,
    PythonCommandResult,
    SolveMultipleParams,
    SolveParams,
    SolverConfigResult,
} from '@/src/entities/models/solver.model';
import type {ScheduleSolutionRaw} from '@/src/entities/models/schedule.model';

export type { SolverConfigResult };

export interface ISolverService {
    /**
     * Validates the Python solver configuration and optionally tests execution.
     */
    validateConfig(): SolverConfigResult;

    /**
     * Runs the Python 'fetch' command to load data from DB into JSON files.
     */
    runFetch(params: FetchParams): PythonCommandResult;

    /**
     * Runs the Python 'solve' command for a single scheduling solution.
     */
    runSolve(params: SolveParams): PythonCommandResult;

    /**
     * Runs the Python 'solve-multiple' command (3 solutions with different weight sets).
     */
    runSolveMultiple(params: SolveMultipleParams): PythonCommandResult;

    /**
     * Runs the Python 'insert' command to write a JSON solution back to DB.
     */
    runInsert(params: InsertParams): PythonCommandResult;

    /**
     * Runs the Python 'delete' command to reset data in DB.
     */
    runDelete(params: DeleteParams): PythonCommandResult;

    /**
     * Checks whether a solution file exists in the found_solutions directory.
     */
    findSolutionFile(filename: string): { exists: boolean; path?: string };

    /**
     * Reads a raw solution JSON file from the found_solutions directory.
     */
    readSolutionFile(filename: string): ScheduleSolutionRaw;

    /**
     * Reads a processed solution JSON file from the processed_solutions directory.
     */
    readProcessedSolutionFile(filename: string): ScheduleSolutionRaw;

    /**
     * Writes a JSON schedule to the found_solutions directory.
     */
    writeSolutionFile(filename: string, content: ScheduleSolutionRaw): Promise<void>;
}
