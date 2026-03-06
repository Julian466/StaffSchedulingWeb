import {randomUUID} from 'crypto';
import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {InsertParams, SolverJob} from '@/src/entities/models/solver.model';

export interface IExecuteSolverInsertUseCase {
    (input: { caseId: number; monthYear: string; params: InsertParams }): Promise<{ job: SolverJob }>;
}

export function makeExecuteSolverInsertUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverInsertUseCase {
    return async ({caseId, monthYear, params}) => {
        const startTime = Date.now();
        const result = solverService.runInsert(params);
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

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success) {
            throw new Error(`Insert command failed: ${result.consoleOutput}`);
        }

        return {job};
    };
}
