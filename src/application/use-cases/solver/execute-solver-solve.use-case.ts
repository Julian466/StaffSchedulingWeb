import {randomUUID} from 'crypto';
import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {SolveParams, SolverJob} from '@/src/entities/models/solver.model';

export interface IExecuteSolverSolveUseCase {
    (input: { caseId: number; monthYear: string; params: SolveParams }): Promise<{ job: SolverJob }>;
}

export function makeExecuteSolverSolveUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverSolveUseCase {
    return async ({caseId, monthYear, params}) => {
        const startTime = Date.now();
        const result = solverService.runSolve(params);
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

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success) {
            throw new Error(`Solve command failed: ${result.consoleOutput}`);
        }

        return {job};
    };
}
