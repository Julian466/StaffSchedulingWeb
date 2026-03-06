import {randomUUID} from 'crypto';
import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {DeleteParams, SolverJob} from '@/src/entities/models/solver.model';
import type {ScheduleSolutionRaw} from "@/src/entities/models";

export interface IExecuteSolverDeleteUseCase {
    (input: { caseId: number; monthYear: string; params: DeleteParams; solution?: ScheduleSolutionRaw }): Promise<{
        job: SolverJob
    }>;
}

export function makeExecuteSolverDeleteUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverDeleteUseCase {
    return async ({caseId, monthYear, params, solution}) => {
        const startTime = Date.now();
        const result = await solverService.deleteData(params, solution);

        const job: SolverJob = {
            id: randomUUID(),
            type: 'delete',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            error: result.error,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration: result.duration,
        };

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success) {
            throw new Error(`Delete failed: ${result.error}`);
        }

        return {job};
    };
}
