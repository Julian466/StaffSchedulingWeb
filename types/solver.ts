/**
 * Types for the Python solver integration.
 * Defines commands, parameters, job states, and results for the StaffScheduling solver.
 */

/**
 * Available solver command types matching Python CLI commands.
 */
export type SolverCommandType = 
  | 'fetch'           // Fetch data from DB and write JSON files
  | 'solve'           // Solve scheduling problem (single solution)
  | 'solve-multiple'  // Solve scheduling problem (multiple solutions)
  | 'insert'          // Insert data from JSON solution files to DB
  | 'delete';          // Delete/reset data in DB

/**
 * Job status (only completed or failed for synchronous execution).
 */
export type SolverJobStatus = 'completed' | 'failed';

/**
 * Base parameters shared across all solver commands.
 */
export interface BaseSolverParams {
  /**
   * Case/unit number.
   */
  unit: number;
  
  /**
   * Start date for the planning period (ISO 8601 format).
   */
  start: string;
  
  /**
   * End date for the planning period (ISO 8601 format).
   */
  end: string;
}

/**
 * Parameters for the 'fetch' command.
 */
export type FetchParams = BaseSolverParams

/**
 * Parameters for the 'solve' command.
 */
export interface SolveParams extends BaseSolverParams {
  /**
   * Timeout in seconds for the solver.
   * @default 300
   */
  timeout?: number;
}

/**
 * Parameters for the 'solve-multiple' command.
 */
export interface SolveMultipleParams extends BaseSolverParams {
  /**
   * Timeout in seconds for the solver.
   * @default 300
   */
  timeout?: number;
}

/**
 * Parameters for the 'insert' command.
 */
export type InsertParams = BaseSolverParams

/**
 * Parameters for the 'delete' command.
 */
export type DeleteParams = BaseSolverParams

/**
 * Union type of all possible solver parameters.
 */
export type SolverParams = 
  | FetchParams 
  | SolveParams 
  | SolveMultipleParams 
  | InsertParams 
  | DeleteParams;

/**
 * Result from executing a Python command.
 */
export interface PythonCommandResult {
  /**
   * Whether the command executed successfully (exit code 0).
   */
  success: boolean;
  
  /**
   * Combined console output (stdout + stderr).
   */
  consoleOutput: string;
  
  /**
   * Exit code from the process.
   */
  exitCode: number;
  
  /**
   * Execution duration in milliseconds.
   */
  duration: number;
}

/**
 * Solver job record stored in job history.
 */
export interface SolverJob {
  /**
   * Unique job identifier.
   */
  id: string;
  
  /**
   * Type of solver command executed.
   */
  type: SolverCommandType;
  
  /**
   * Job execution status.
   */
  status: SolverJobStatus;
  
  /**
   * Case ID this job belongs to.
   */
  caseId: number;
  
  /**
   * Command parameters used.
   */
  params: SolverParams;
  
  /**
   * Combined console output from command execution.
   */
  consoleOutput: string;
  
  /**
   * Exit code from the process.
   */
  exitCode: number;
  
  /**
   * ISO 8601 timestamp when job was created.
   */
  createdAt: string;
  
  /**
   * ISO 8601 timestamp when job completed or failed.
   */
  completedAt: string;
  
  /**
   * Execution duration in milliseconds.
   */
  duration: number;
  
  /**
   * Optional metadata for solve-multiple jobs.
   */
  metadata?: {
    solutionsGenerated?: number;      // Number of successful solutions (with FEASIBLE status)
    expectedSolutions?: number;        // Expected number of solutions (usually 3)
    feasibleSolutions?: number[];     // Indices of feasible solutions (e.g., [0, 1, 2])
  };
}

/**
 * Job history data structure stored in jobs.json.
 */
export interface JobHistoryData {
  /**
   * Array of job records (max 50, FIFO).
   */
  jobs: SolverJob[];
}

/**
 * Response from solve-multiple command with generated schedule information.
 */
export interface SolveMultipleResult {
  /**
   * Number of solutions generated.
   */
  solutionsGenerated: number;
  
  /**
   * List of generated schedule file paths or IDs.
   */
  scheduleFiles: string[];
  
  /**
   * Command execution result.
   */
  commandResult: PythonCommandResult;
}
