'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import type {
    DeleteParams,
    FetchParams,
    InsertParams,
    SolveMultipleParams,
    SolveParams,
    SolverJob,
} from '@/src/entities/models/solver.model';
import type {SolverConfigResult} from '@/src/application/ports/solver.service';
import type {
    SolveMultipleScheduleInfo
} from '@/src/application/use-cases/solver/execute-solver-solve-multiple.use-case';
import type {SaveSolutionResult} from '@/src/application/use-cases/solver/save-solution.use-case';
import type {ImportSolutionResult} from '@/src/application/use-cases/solver/import-solution.use-case';

export async function validateConfig(): Promise<SolverConfigResult> {
    const controller = getInjection('IValidateConfigController');
    const result = controller();
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function solverFetch(
    caseId: number,
    monthYear: string,
    params: FetchParams
): Promise<{ job: SolverJob }> {
    const controller = getInjection('IExecuteSolverFetchController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return result.data;
}

export async function solverSolve(
    caseId: number,
    monthYear: string,
    params: SolveParams
): Promise<{ job: SolverJob }> {
    const controller = getInjection('IExecuteSolverSolveController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return result.data;
}

export async function solverSolveMultiple(
    caseId: number,
    monthYear: string,
    params: SolveMultipleParams
): Promise<{ job: SolverJob; scheduleInfo: SolveMultipleScheduleInfo }> {
    const controller = getInjection('IExecuteSolverSolveMultipleController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return result.data;
}

export async function solverInsert(
    caseId: number,
    monthYear: string,
    params: InsertParams
): Promise<{ job: SolverJob }> {
    const controller = getInjection('IExecuteSolverInsertController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return result.data;
}

export async function solverDelete(
    caseId: number,
    monthYear: string,
    params: DeleteParams
): Promise<{ job: SolverJob }> {
    const controller = getInjection('IExecuteSolverDeleteController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return result.data;
}

export async function findSolutionFile(
    filename: string
): Promise<{ exists: boolean; path?: string }> {
    const controller = getInjection('IFindSolutionFileController');
    const result = controller({filename});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function saveSolution(
    caseId: number,
    monthYear: string,
    start: string,
    end: string
): Promise<SaveSolutionResult> {
    const controller = getInjection('ISaveSolutionController');
    const result = await controller({caseId, monthYear, start, end});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function importSolution(
    caseId: number,
    monthYear: string,
    params: { start: string; end: string; solutionType: string }
): Promise<ImportSolutionResult> {
    const controller = getInjection('IImportSolutionController');
    const result = await controller({caseId, monthYear, ...params});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/schedule');
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return result.data;
}

export async function getJobs(
    caseId: number,
    monthYear: string
): Promise<{ jobs: SolverJob[] }> {
    const controller = getInjection('IGetAllJobsController');
    const result = await controller({caseId, monthYear});
    if ('error' in result) throw new Error(result.error);
    return {jobs: result.data};
}

export async function getJob(
    caseId: number,
    monthYear: string,
    jobId: string
): Promise<{ job: SolverJob }> {
    const controller = getInjection('IGetJobController');
    const result = await controller({caseId, monthYear, jobId});
    if ('error' in result) throw new Error('Job not found');
    return {job: result.data};
}
