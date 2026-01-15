import {spawnSync, SpawnSyncReturns} from 'child_process';
import {getPythonConfig} from '@/lib/config/app-config';
import {createApiLogger} from '@/lib/logging/logger';
import {
    PythonCommandResult,
    FetchParams,
    SolveParams,
    SolveMultipleParams,
    InsertParams,
    DeleteParams,
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
    timeoutMs?: number,
    useEnvFile: boolean = false
): PythonCommandResult {
    const startTime = Date.now();
    const pythonConfig = getPythonConfig();

    logger.info('Executing Python command', {
        command,
        args,
        pythonExecutable: pythonConfig.pythonExecutable,
        projectPath: pythonConfig.path,
        useEnvFile,
    });

    // Build args array with or without --env-file
    const commandArgs = useEnvFile
        ? ['run', '--env-file', '.env', 'staff-scheduling', command, ...args]
        : ['run', 'staff-scheduling', command, ...args];

    // log exactly what I am executing
    logger.debug('Spawning process', {
        command: pythonConfig.pythonExecutable,
        fullArgs: commandArgs,
    });

    try {
        const result: SpawnSyncReturns<string> = spawnSync(
            pythonConfig.pythonExecutable,
            commandArgs,
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

        // Combine stdout and stderr into single console output
        const consoleOutput = (result.stdout || '') + (result.stderr || '');

        // Check if command actually succeeded by analyzing output
        // For solve commands, check if "- status         : FEASIBLE" appears in output
        let actualSuccess = exitCode === 0;

        if (command === 'solve' || command === 'solve-multiple') {
            // Check if the output contains "- status         : FEASIBLE"
            // This is the only indicator of a successful solve
            if (consoleOutput.includes('- status         : FEASIBLE')) {
                actualSuccess = true;
                logger.info(`${command} completed successfully with FEASIBLE status`, {
                    exitCode,
                });
            } else {
                // If FEASIBLE status is not found, the solve was not successful
                actualSuccess = false;
                logger.warn(`${command} did not produce FEASIBLE status`, {
                    exitCode,
                });
            }
        }

        const commandResult: PythonCommandResult = {
            success: actualSuccess,
            consoleOutput,
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
                consoleOutput: result.stderr || result.error.message,
                exitCode: -1,
                duration,
            };
        }

        if (!actualSuccess) {
            logger.warn('Python command failed', {
                command,
                exitCode,
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
            consoleOutput: error instanceof Error ? error.message : String(error),
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

    return executePythonCommand('fetch', args, undefined, true);
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
 * Solves the scheduling problem with 3 different weight sets (runs solve 3 times).
 */
export function executeSolveMultiple(
    params: SolveMultipleParams
): PythonCommandResult {
    const args = [
        String(params.unit),
        formatDateForPython(params.start),
        formatDateForPython(params.end),
    ];

    if (params.timeout) {
        args.push('--timeout', String(params.timeout));
    }

    // Convert timeout to milliseconds, add buffer for process overhead
    // solve-multiple runs 3 times with different weight sets, so multiply by 3
    const timeoutMs = params.timeout ? (params.timeout * 3 + 30) * 1000 : undefined;

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

    return executePythonCommand('insert', args, undefined, true);
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

    return executePythonCommand('delete', args, undefined, true);
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
