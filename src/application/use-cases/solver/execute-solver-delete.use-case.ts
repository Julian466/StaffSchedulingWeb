import {randomUUID} from 'crypto';
import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {DeleteParams, SolverJob} from '@/src/entities/models/solver.model';

export interface IExecuteSolverDeleteUseCase {
    (input: { caseId: number; monthYear: string; params: DeleteParams }): Promise<{ job: SolverJob }>;
}

export function makeExecuteSolverDeleteUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverDeleteUseCase {
    return async ({caseId, monthYear, params}) => {
        const startTime = Date.now();
        const result = solverService.runDelete(params);
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

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success) {
            throw new Error(`Delete command failed: ${result.consoleOutput}`);
        }

        return {job};
    };
}
