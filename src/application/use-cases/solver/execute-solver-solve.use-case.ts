import { randomUUID } from 'crypto';
import type { ISolverService } from '@/src/application/ports/solver.service';
import type { IJobRepository } from '@/src/application/ports/job.repository';
import type { SolveParams, SolverJob } from '@/src/entities/models/solver.model';
import type { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';
import { SolveInfeasibleError, SolveUnknownError } from '@/src/entities/errors/solver.errors';

export interface IExecuteSolverSolveUseCase {
    (input: {
        caseId: number;
        monthYear: string;
        params: SolveParams;
    }): Promise<{ job: SolverJob; solution: ScheduleSolutionRaw }>;
}

export function makeExecuteSolverSolveUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverSolveUseCase {
    return async ({ caseId, monthYear, params }) => {
        const startTime = Date.now();
        const result = await solverService.solve(params);

        const job: SolverJob = {
            id: randomUUID(),
            type: 'solve',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            error: result.error,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration: result.duration,
            metadata: {
                solutionsGenerated: result.success ? 1 : 0,
                expectedSolutions: 1,
                feasibleSolutions: result.success ? [0] : [],
            },
        };

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success || !result.solution) {
            if (result.status === 'INFEASIBLE') throw new SolveInfeasibleError(result.error);
            throw new SolveUnknownError(result.error);
        }

        return { job, solution: result.solution };
    };
}
