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
  | 'delete'          // Delete/reset data in DB
  | 'process-solution'; // Process and export solution as JSON

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
   * Maximum number of solutions to generate.
   */
  maxSolutions: number;
  
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
 * Parameters for the 'process-solution' command.
 */
export interface ProcessSolutionParams {
  /**
   * Case number.
   */
  case: number;
  
  /**
   * Solution filename (optional).
   */
  filename?: string;
  
  /**
   * Output filename.
   * @default 'processed_solution.json'
   */
  output?: string;
  
  /**
   * Enable debug output.
   * @default false
   */
  debug?: boolean;
}

/**
 * Union type of all possible solver parameters.
 */
export type SolverParams = 
  | FetchParams 
  | SolveParams 
  | SolveMultipleParams 
  | InsertParams 
  | DeleteParams 
  | ProcessSolutionParams;

/**
 * Result from executing a Python command.
 */
export interface PythonCommandResult {
  /**
   * Whether the command executed successfully (exit code 0).
   */
  success: boolean;
  
  /**
   * Standard output from the command.
   */
  stdout: string;
  
  /**
   * Standard error output from the command.
   */
  stderr: string;
  
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
   * Execution result (only present if status is 'completed').
   */
  result?: PythonCommandResult;
  
  /**
   * Error message (only present if status is 'failed').
   */
  error?: string;
  
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
