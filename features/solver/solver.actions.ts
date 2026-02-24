'use server';

import {createApiLogger} from '@/lib/logging/logger';
import {getPythonConfig, PythonConfigValidation, validatePythonConfig} from '@/lib/config/app-config';
import {
    executeDelete,
    executeFetch,
    executeInsert,
    executeSolve,
    executeSolveMultiple,
    testPythonConfiguration,
} from '@/lib/services/python-cli-service';
import {jobRepository} from '@/features/solver/api/job-repository';
import {ScheduleRepository} from '@/features/schedule/api/schedule-repository';
import {getInjection} from '@/di/container';
import {
    DeleteParams,
    FetchParams,
    InsertParams,
    SolveMultipleParams,
    SolveParams,
    SolverJob,
} from '@/src/entities/models/solver.model';
import {ScheduleSolutionRaw} from '@/src/entities/models/schedule.model';
import {randomUUID} from 'crypto';
import {existsSync, promises as fs, readFileSync} from 'fs';
import path, {join} from 'path';

const apiLogger = createApiLogger('solver-actions');

export async function validateConfig(): Promise<
    PythonConfigValidation & {
    pythonExecutable: string;
    staffSchedulingPath: string;
    executionTest: {
        success: boolean;
        message: string;
        details?: string;
    } | null;
}
> {
    try {
        apiLogger.info('Validating Python configuration');

        const configValidation = validatePythonConfig();
        const pythonConfig = getPythonConfig();

        let executionTest = null;
        if (configValidation.isValid && configValidation.isEnabled) {
            executionTest = testPythonConfiguration();
        }

        const response = {
            ...configValidation,
            pythonExecutable: pythonConfig.pythonExecutable,
            staffSchedulingPath: pythonConfig.path,
            executionTest,
        };

        apiLogger.info('Configuration validation completed', {
            isValid: configValidation.isValid,
            isEnabled: configValidation.isEnabled,
            hasErrors: configValidation.errors.length > 0,
            executionTestSuccess: executionTest?.success,
        });

        return response;
    } catch (error) {
        apiLogger.error('Error validating configuration', {error});
        throw new Error(
            `Failed to validate configuration: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

export async function solverFetch(
    caseId: number,
    monthYear: string,
    params: FetchParams
): Promise<{ job: SolverJob }> {
    try {
        apiLogger.info('Executing fetch command', {caseId, monthYear, params});

        const configValidation = validatePythonConfig();
        if (!configValidation.isValid || !configValidation.isEnabled) {
            apiLogger.error('Invalid Python configuration', {
                errors: configValidation.errors,
            });
            throw new Error(
                `Python solver configuration is invalid: ${configValidation.errors.join('; ')}`
            );
        }

        const startTime = Date.now();
        const result = executeFetch(params);
        const duration = Date.now() - startTime;

        const job: SolverJob = {
            id: randomUUID(),
            type: 'fetch',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            consoleOutput: result.consoleOutput,
            exitCode: result.exitCode,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration,
        };

        await jobRepository.create(job, caseId, monthYear);

        apiLogger.info('Fetch command completed', {
            caseId,
            monthYear,
            jobId: job.id,
            success: result.success,
            duration,
        });

        if (!result.success) {
            throw new Error(`Fetch command failed: ${result.consoleOutput}`);
        }

        return {job};
    } catch (error) {
        apiLogger.error('Error executing fetch command', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to execute fetch command: ${String(error)}`);
    }
}

export async function solverSolve(
    caseId: number,
    monthYear: string,
    params: SolveParams
): Promise<{ job: SolverJob }> {
    try {
        apiLogger.info('Executing solve command', {caseId, monthYear, params});

        const configValidation = validatePythonConfig();
        if (!configValidation.isValid || !configValidation.isEnabled) {
            apiLogger.error('Invalid Python configuration', {
                errors: configValidation.errors,
            });
            throw new Error(
                `Python solver configuration is invalid: ${configValidation.errors.join('; ')}`
            );
        }

        const startTime = Date.now();
        const result = executeSolve(params);
        const duration = Date.now() - startTime;

        const job: SolverJob = {
            id: randomUUID(),
            type: 'solve',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            consoleOutput: result.consoleOutput,
            exitCode: result.exitCode,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration,
        };

        await jobRepository.create(job, caseId, monthYear);

        apiLogger.info('Solve command completed', {
            caseId,
            monthYear,
            jobId: job.id,
            success: result.success,
            duration,
        });

        if (!result.success) {
            throw new Error(`Solve command failed: ${result.consoleOutput}`);
        }

        return {job};
    } catch (error) {
        apiLogger.error('Error executing solve command', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to execute solve command: ${String(error)}`);
    }
}

export async function solverSolveMultiple(
    caseId: number,
    monthYear: string,
    params: SolveMultipleParams
): Promise<{
    job: SolverJob;
    scheduleInfo: {
        solutionsGenerated: number;
        scheduleFiles: string[];
        feasibleSolutions: number[];
    };
}> {
    try {
        apiLogger.info('Executing solve-multiple command', {caseId, monthYear, params});

        const configValidation = validatePythonConfig();
        if (!configValidation.isValid || !configValidation.isEnabled) {
            apiLogger.error('Invalid Python configuration', {
                errors: configValidation.errors,
            });
            throw new Error(
                `Python solver configuration is invalid: ${configValidation.errors.join('; ')}`
            );
        }

        const startTime = Date.now();
        const result = executeSolveMultiple(params);
        const duration = Date.now() - startTime;

        // Parse output to extract information about generated schedules
        const scheduleInfo = {
            solutionsGenerated: 0,
            scheduleFiles: [] as string[],
            feasibleSolutions: [] as number[],
        };

        if (result.success) {
            const output = result.consoleOutput;

            // Count number of "- status         : FEASIBLE" lines
            const feasibleMatches = output.match(/- status\s+:\s+FEASIBLE/g);
            if (feasibleMatches) {
                scheduleInfo.solutionsGenerated = feasibleMatches.length;
                scheduleInfo.feasibleSolutions = Array.from(
                    {length: feasibleMatches.length},
                    (_, i) => i
                );
            }

            // Look for schedule file references
            const lines = output.split('\n');
            for (const line of lines) {
                const matchFile = line.match(/solution[_-]\d+[_-].+?\.json/i);
                if (matchFile && !scheduleInfo.scheduleFiles.includes(matchFile[0])) {
                    scheduleInfo.scheduleFiles.push(matchFile[0]);
                }
            }
        }

        const job: SolverJob = {
            id: randomUUID(),
            type: 'solve-multiple',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            consoleOutput: result.consoleOutput,
            exitCode: result.exitCode,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration,
            metadata: {
                solutionsGenerated: scheduleInfo.solutionsGenerated,
                expectedSolutions: 3,
                feasibleSolutions: scheduleInfo.feasibleSolutions,
            },
        };

        await jobRepository.create(job, caseId, monthYear);

        apiLogger.info('Solve-multiple command completed', {
            caseId,
            monthYear,
            jobId: job.id,
            success: result.success,
            duration,
            ...scheduleInfo,
        });

        if (!result.success) {
            throw new Error(`Solve-multiple command failed: ${result.consoleOutput}`);
        }

        return {job, scheduleInfo};
    } catch (error) {
        apiLogger.error('Error executing solve-multiple command', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to execute solve-multiple command: ${String(error)}`);
    }
}

export async function solverInsert(
    caseId: number,
    monthYear: string,
    params: InsertParams
): Promise<{ job: SolverJob }> {
    try {
        apiLogger.info('Executing insert command', {caseId, monthYear, params});

        const configValidation = validatePythonConfig();
        if (!configValidation.isValid || !configValidation.isEnabled) {
            apiLogger.error('Invalid Python configuration', {
                errors: configValidation.errors,
            });
            throw new Error(
                `Python solver configuration is invalid: ${configValidation.errors.join('; ')}`
            );
        }

        const startTime = Date.now();
        const result = executeInsert(params);
        const duration = Date.now() - startTime;

        const job: SolverJob = {
            id: randomUUID(),
            type: 'insert',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            consoleOutput: result.consoleOutput,
            exitCode: result.exitCode,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration,
        };

        await jobRepository.create(job, caseId, monthYear);

        apiLogger.info('Insert command completed', {
            caseId,
            monthYear,
            jobId: job.id,
            success: result.success,
            duration,
        });

        if (!result.success) {
            throw new Error(`Insert command failed: ${result.consoleOutput}`);
        }

        return {job};
    } catch (error) {
        apiLogger.error('Error executing insert command', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to execute insert command: ${String(error)}`);
    }
}

export async function solverDelete(
    caseId: number,
    monthYear: string,
    params: DeleteParams
): Promise<{ job: SolverJob }> {
    try {
        apiLogger.info('Executing delete command', {caseId, monthYear, params});

        const configValidation = validatePythonConfig();
        if (!configValidation.isValid || !configValidation.isEnabled) {
            apiLogger.error('Invalid Python configuration', {
                errors: configValidation.errors,
            });
            throw new Error(
                `Python solver configuration is invalid: ${configValidation.errors.join('; ')}`
            );
        }

        const startTime = Date.now();
        const result = executeDelete(params);
        const duration = Date.now() - startTime;

        const job: SolverJob = {
            id: randomUUID(),
            type: 'delete',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            consoleOutput: result.consoleOutput,
            exitCode: result.exitCode,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration,
        };

        await jobRepository.create(job, caseId, monthYear);

        apiLogger.info('Delete command completed', {
            caseId,
            monthYear,
            jobId: job.id,
            success: result.success,
            duration,
        });

        if (!result.success) {
            throw new Error(`Delete command failed: ${result.consoleOutput}`);
        }

        return {job};
    } catch (error) {
        apiLogger.error('Error executing delete command', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to execute delete command: ${String(error)}`);
    }
}

export async function findSolutionFile(
    filename: string
): Promise<{ exists: boolean; path?: string }> {
    try {
        if (!filename) {
            throw new Error('Filename parameter is required');
        }

        const pythonConfig = getPythonConfig();

        if (!pythonConfig.include || !pythonConfig.path) {
            throw new Error('StaffScheduling project is not configured');
        }

        const solutionPath = join(pythonConfig.path, 'found_solutions', filename);
        const exists = existsSync(solutionPath);

        apiLogger.info('Checking solution file', {
            filename,
            path: solutionPath,
            exists,
        });

        return {
            exists,
            path: exists ? solutionPath : undefined,
        };
    } catch (error) {
        apiLogger.error('Error checking solution file', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to check solution file: ${String(error)}`);
    }
}

export async function saveSolution(
    caseId: number,
    monthYear: string,
    start: string,
    end: string
): Promise<{ success: boolean; filename: string; path: string }> {
    try {
        if (!start || !end) {
            throw new Error('start and end dates are required');
        }

        apiLogger.info('Saving selected solution', {caseId, monthYear, start, end});

        const configValidation = validatePythonConfig();
        if (!configValidation.isValid || !configValidation.isEnabled) {
            apiLogger.error('Invalid Python configuration', {
                errors: configValidation.errors,
            });
            throw new Error(
                `Python solver configuration is invalid or StaffScheduling path not configured: ${configValidation.errors.join('; ')}`
            );
        }

        const pythonConfig = getPythonConfig();
        const staffSchedulingPath = pythonConfig.path;

        if (!staffSchedulingPath) {
            apiLogger.error('StaffScheduling path not configured');
            throw new Error('StaffScheduling path is not configured');
        }

        const selectedSchedule = await ScheduleRepository.getSelectedSchedule(caseId, monthYear);

        if (!selectedSchedule) {
            apiLogger.warn('No schedule selected', {caseId, monthYear});
            throw new Error('No schedule is currently selected');
        }

        const formatDateForFilename = (isoDate: string): string => {
            const date = new Date(isoDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedStart = formatDateForFilename(start);
        const formattedEnd = formatDateForFilename(end);

        const filename = `solution_${caseId}_${formattedStart}-${formattedEnd}.json`;

        const targetDir = path.join(staffSchedulingPath, 'found_solutions');
        const targetPath = path.join(targetDir, filename);

        await fs.mkdir(targetDir, {recursive: true});

        await fs.writeFile(
            targetPath,
            JSON.stringify(selectedSchedule, null, 2),
            'utf8'
        );

        apiLogger.info('Solution saved successfully', {
            caseId,
            filename,
            targetPath,
        });

        return {
            success: true,
            filename,
            path: targetPath,
        };
    } catch (error) {
        apiLogger.error('Error saving solution', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to save solution: ${String(error)}`);
    }
}

export async function importSolution(
    caseId: number,
    monthYear: string,
    params: {
        start: string;
        end: string;
        solutionType: string;
    }
): Promise<{
    success: boolean;
    scheduleId: string;
    filename: string;
    message: string;
}> {
    try {
        const {start, end, solutionType} = params;

        if (!start || !end || !solutionType) {
            throw new Error('Missing required fields: start, end, solutionType');
        }

        apiLogger.info('Importing processed solution', {
            caseId,
            monthYear,
            start,
            end,
            solutionType,
        });

        const pythonConfig = getPythonConfig();
        if (!pythonConfig.path) {
            apiLogger.error('StaffScheduling path not configured');
            throw new Error('StaffScheduling project path not configured');
        }

        const formatDateForFilename = (dateStr: string) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startFormatted = formatDateForFilename(start);
        const endFormatted = formatDateForFilename(end);

        const filename = `solution_${caseId}_${startFormatted}-${endFormatted}_${solutionType}_processed.json`;
        const filePath = join(pythonConfig.path, 'processed_solutions', filename);

        apiLogger.info('Looking for file', {filePath});

        if (!existsSync(filePath)) {
            apiLogger.error('Solution file not found', {filePath});
            throw new Error(`Solution file not found. Expected file: ${filename}`);
        }

        let solution: ScheduleSolutionRaw;
        try {
            const fileContent = readFileSync(filePath, 'utf-8');
            solution = JSON.parse(fileContent);
        } catch (parseError) {
            apiLogger.error('Failed to read or parse solution file', {error: parseError, filePath});
            throw new Error(
                `Failed to read or parse solution file: ${parseError instanceof Error ? parseError.message : String(parseError)}`
            );
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const scheduleId = `imported_${solutionType}_${timestamp}`;
        const description = `Automatisch importiert: ${solutionType} (${startFormatted} bis ${endFormatted})`;

        await ScheduleRepository.saveSchedule(
            caseId,
            monthYear,
            scheduleId,
            description,
            solution,
            true
        );

        apiLogger.info('Solution imported successfully', {
            caseId,
            monthYear,
            scheduleId,
            filename,
        });

        return {
            success: true,
            scheduleId,
            filename,
            message: 'Solution imported successfully',
        };
    } catch (error) {
        apiLogger.error('Error importing solution', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to import solution: ${String(error)}`);
    }
}

export async function getJobs(
    caseId: number,
    monthYear: string
): Promise<{ jobs: SolverJob[] }> {
    try {
        apiLogger.info('Fetching job history', {caseId, monthYear});

        const controller = getInjection('IGetAllJobsController');
        const result = await controller({caseId, monthYear});

        if ('error' in result) {
            throw new Error(result.error);
        }

        apiLogger.info('Job history retrieved', {
            caseId,
            monthYear,
            jobCount: result.data.length,
        });

        return {jobs: result.data};
    } catch (error) {
        apiLogger.error('Error fetching job history', {caseId, monthYear, error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to fetch job history: ${String(error)}`);
    }
}

export async function getJob(
    caseId: number,
    monthYear: string,
    jobId: string
): Promise<{ job: SolverJob }> {
    try {
        apiLogger.info('Fetching job', {caseId, monthYear, jobId});

        const controller = getInjection('IGetJobController');
        const result = await controller({caseId, monthYear, jobId});

        if ('error' in result) {
            throw new Error('Job not found');
        }

        apiLogger.info('Job retrieved', {caseId, monthYear, jobId, status: result.data.status});

        return {job: result.data};
    } catch (error) {
        apiLogger.error('Error fetching job', {error});
        throw error instanceof Error
            ? error
            : new Error(`Failed to fetch job: ${String(error)}`);
    }
}
