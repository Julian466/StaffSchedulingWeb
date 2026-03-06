'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import type {
    DeleteParams,
    FetchParams,
    ImportSolutionResult,
    InsertParams,
    SaveSolutionResult,
    SolveMultipleParams,
    SolveMultipleScheduleInfo,
    SolveParams,
    SolverConfigResult,
    SolverJob,
} from '@/src/entities/models/solver.model';
import type {ActionResult} from '@/src/entities/models/action-result.model';

export async function validateConfig(): Promise<ActionResult<SolverConfigResult>> {
    const controller = getInjection('IValidateConfigController');
    const result = controller();
    if ('error' in result) return {success: false, error: result.error};
    return {success: true, data: result.data};
}

export async function solverFetch(
    caseId: number,
    monthYear: string,
    params: FetchParams
): Promise<ActionResult<{ job: SolverJob }>> {
    const controller = getInjection('IExecuteSolverFetchController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) return {success: false, error: result.error};
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return {success: true, data: result.data};
}

export async function solverSolve(
    caseId: number,
    monthYear: string,
    params: SolveParams
): Promise<ActionResult<{ job: SolverJob }>> {
    const controller = getInjection('IExecuteSolverSolveController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) return {success: false, error: result.error};
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return {success: true, data: result.data};
}

export async function solverSolveMultiple(
    caseId: number,
    monthYear: string,
    params: SolveMultipleParams
): Promise<ActionResult<{ job: SolverJob; scheduleInfo: SolveMultipleScheduleInfo }>> {
    const controller = getInjection('IExecuteSolverSolveMultipleController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) return {success: false, error: result.error};
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return {success: true, data: result.data};
}

export async function solverInsert(
    caseId: number,
    monthYear: string,
    params: InsertParams
): Promise<ActionResult<{ job: SolverJob }>> {
    const controller = getInjection('IExecuteSolverInsertController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) return {success: false, error: result.error};
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return {success: true, data: result.data};
}

export async function solverDelete(
    caseId: number,
    monthYear: string,
    params: DeleteParams
): Promise<ActionResult<{ job: SolverJob }>> {
    const controller = getInjection('IExecuteSolverDeleteController');
    const result = await controller({caseId, monthYear, params});
    if ('error' in result) return {success: false, error: result.error};
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return {success: true, data: result.data};
}

export async function findSolutionFile(
    filename: string
): Promise<ActionResult<{ exists: boolean; path?: string }>> {
    const controller = getInjection('IFindSolutionFileController');
    const result = controller({filename});
    if ('error' in result) return {success: false, error: result.error};
    return {success: true, data: result.data};
}

export async function saveSolution(
    caseId: number,
    monthYear: string,
    start: string,
    end: string
): Promise<ActionResult<SaveSolutionResult>> {
    const controller = getInjection('ISaveSolutionController');
    const result = await controller({caseId, monthYear, start, end});
    if ('error' in result) return {success: false, error: result.error};
    return {success: true, data: result.data};
}

export async function importSolution(
    caseId: number,
    monthYear: string,
    params: { start: string; end: string; solutionType: string }
): Promise<ActionResult<ImportSolutionResult>> {
    const controller = getInjection('IImportSolutionController');
    const result = await controller({caseId, monthYear, ...params});
    if ('error' in result) return {success: false, error: result.error};
    revalidatePath('/schedule');
    revalidatePath('/solver');
    revalidatePath('/workflow');
    return {success: true, data: result.data};
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
