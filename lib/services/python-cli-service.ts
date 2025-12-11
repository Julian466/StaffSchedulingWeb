import { spawnSync, SpawnSyncReturns } from 'child_process';
import { getPythonConfig } from '@/lib/config/app-config';
import { createApiLogger } from '@/lib/logging/logger';
import {
  PythonCommandResult,
  FetchParams,
  SolveParams,
  SolveMultipleParams,
  InsertParams,
  DeleteParams,
  ProcessSolutionParams,
} from '@/types/solver';

const logger = createApiLogger('python-cli-service');

/**
 * Formats a Date object or ISO string to DD.MM.YYYY format for Python CLI.
 */
function formatDateForPython(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Executes a Python command synchronously using spawn.
 */
function executePythonCommand(
  command: string,
  args: string[],
  timeoutMs?: number
): PythonCommandResult {
  const startTime = Date.now();
  const pythonConfig = getPythonConfig();
  
  logger.info('Executing Python command', {
    command,
    args,
    pythonExecutable: pythonConfig.pythonExecutable,
    projectPath: pythonConfig.path,
  });

  // log exactly what I am executing
  logger.debug('Spawning process', {
    command: pythonConfig.pythonExecutable,
    fullArgs: ['run', 'staff-scheduling', command, ...args],
  });

  try {
    const result: SpawnSyncReturns<string> = spawnSync(
      pythonConfig.pythonExecutable,
      ['run', 'staff-scheduling', command, ...args],
      {
        cwd: pythonConfig.path,
        encoding: 'utf-8',
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
        shell: process.platform === 'win32', // Use shell on Windows for proper command resolution
      }
    );

    const duration = Date.now() - startTime;
    const exitCode = result.status ?? -1;
    const success = exitCode === 0;

    const commandResult: PythonCommandResult = {
      success,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode,
      duration,
    };

    if (result.error) {
      logger.error('Python command execution error', {
        command,
        error: result.error.message,
        duration,
      });
      
      return {
        success: false,
        stdout: result.stdout || '',
        stderr: result.stderr || result.error.message,
        exitCode: -1,
        duration,
      };
    }

    if (!success) {
      logger.warn('Python command failed', {
        command,
        exitCode,
        stderr: result.stderr,
        duration,
      });
    } else {
      logger.info('Python command completed successfully', {
        command,
        duration,
      });
    }

    return commandResult;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Unexpected error executing Python command', {
      command,
      error: error instanceof Error ? error.message : String(error),
      duration,
    });

    return {
      success: false,
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: -1,
      duration,
    };
  }
}

/**
 * Builds and executes the 'fetch' command.
 * Fetches data from DB and writes JSON files.
 */
export function executeFetch(params: FetchParams): PythonCommandResult {
  const args = [
    String(params.unit),
    formatDateForPython(params.start),
    formatDateForPython(params.end),
  ];

  return executePythonCommand('fetch', args);
}

/**
 * Builds and executes the 'solve' command.
 * Solves the scheduling problem for a single solution.
 */
export function executeSolve(params: SolveParams): PythonCommandResult {
  const args = [
    String(params.unit),
    formatDateForPython(params.start),
    formatDateForPython(params.end),
  ];

  if (params.timeout) {
    args.push('--timeout', String(params.timeout));
  }

  // Convert timeout to milliseconds, add buffer for process overhead
  const timeoutMs = params.timeout ? (params.timeout + 10) * 1000 : undefined;

  return executePythonCommand('solve', args, timeoutMs);
}

/**
 * Builds and executes the 'solve-multiple' command.
 * Solves the scheduling problem for multiple solutions.
 */
export function executeSolveMultiple(
  params: SolveMultipleParams
): PythonCommandResult {
  const args = [
    String(params.unit),
    formatDateForPython(params.start),
    formatDateForPython(params.end),
    String(params.maxSolutions),
  ];

  if (params.timeout) {
    args.push('--timeout', String(params.timeout));
  }

  // Convert timeout to milliseconds, add buffer for process overhead
  const timeoutMs = params.timeout ? (params.timeout + 10) * 1000 : undefined;

  return executePythonCommand('solve-multiple', args, timeoutMs);
}

/**
 * Builds and executes the 'insert' command.
 * Inserts data from JSON solution files to DB.
 */
export function executeInsert(params: InsertParams): PythonCommandResult {
  const args = [
    String(params.unit),
    formatDateForPython(params.start),
    formatDateForPython(params.end),
  ];

  return executePythonCommand('insert', args);
}

/**
 * Builds and executes the 'delete' command.
 * Deletes/resets data in DB.
 */
export function executeDelete(params: DeleteParams): PythonCommandResult {
  const args = [
    String(params.unit),
    formatDateForPython(params.start),
    formatDateForPython(params.end),
  ];

  return executePythonCommand('delete', args);
}

/**
 * Builds and executes the 'process-solution' command.
 * Processes a solution and exports it as JSON.
 */
export function executeProcessSolution(
  params: ProcessSolutionParams
): PythonCommandResult {
  const args = [String(params.case)];

  if (params.filename) {
    args.push('--filename', params.filename);
  }

  if (params.output) {
    args.push('--output', params.output);
  }

  if (params.debug) {
    args.push('--debug');
  }

  return executePythonCommand('process-solution', args);
}

/**
 * Tests the Python configuration by running a simple command.
 * Returns validation result.
 */
export function testPythonConfiguration(): {
  success: boolean;
  message: string;
  details?: string;
} {
  try {
    const pythonConfig = getPythonConfig();
    
    if (!pythonConfig.include) {
      return {
        success: false,
        message: 'Python solver integration is not enabled in configuration',
      };
    }

    // Try to execute a simple command to test the setup
    const result = spawnSync(pythonConfig.pythonExecutable, ['--version'], {
      cwd: pythonConfig.path,
      encoding: 'utf-8',
      timeout: 5000,
      shell: process.platform === 'win32',
    });

    if (result.error) {
      return {
        success: false,
        message: 'Failed to execute Python command',
        details: result.error.message,
      };
    }

    if (result.status !== 0) {
      return {
        success: false,
        message: 'Python executable test failed',
        details: result.stderr || 'Unknown error',
      };
    }

    const versionOutput = result.stdout || result.stderr || '';
    
    return {
      success: true,
      message: 'Python configuration is valid',
      details: versionOutput.trim(),
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error testing Python configuration',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
