import { randomUUID } from 'crypto';
import type { ISolverService } from '@/src/application/ports/solver.service';
import type { IJobRepository } from '@/src/application/ports/job.repository';
import type { FetchParams, SolverJob } from '@/src/entities/models/solver.model';

export interface IExecuteSolverFetchUseCase {
    (input: { caseId: number; monthYear: string; params: FetchParams }): Promise<{ job: SolverJob }>;
}

export function makeExecuteSolverFetchUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverFetchUseCase {
    return async ({ caseId, monthYear, params }) => {
        const startTime = Date.now();
        const result = await solverService.fetchData(params);

        const job: SolverJob = {
            id: randomUUID(),
            type: 'fetch',
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
            throw new Error(`Fetch failed: ${result.error}`);
        }

        return { job };
    };
}
