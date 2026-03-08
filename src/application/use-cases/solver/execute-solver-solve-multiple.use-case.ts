import { randomUUID } from 'crypto';
import type { ISolverService } from '@/src/application/ports/solver.service';
import type { IJobRepository } from '@/src/application/ports/job.repository';
import type { SolveMultipleParams, SolveMultipleScheduleInfo, SolverJob } from '@/src/entities/models/solver.model';
import type { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';
import { SolveUnknownError } from '@/src/entities/errors/solver.errors';

export type { SolveMultipleScheduleInfo };

export interface IExecuteSolverSolveMultipleUseCase {
    (input: {
        caseId: number;
        monthYear: string;
        params: SolveMultipleParams;
    }): Promise<{ job: SolverJob; scheduleInfo: SolveMultipleScheduleInfo; solutions: ScheduleSolutionRaw[] }>;
}

export function makeExecuteSolverSolveMultipleUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverSolveMultipleUseCase {
    return async ({ caseId, monthYear, params }) => {
        const startTime = Date.now();
        const result = await solverService.solveMultiple(params);

        // scheduleInfo bleibt als bekanntes Shape für Consumers
        const scheduleInfo: SolveMultipleScheduleInfo = {
            solutionsGenerated: result.feasibleCount,
            scheduleFiles: [],           // Nur CLI-relevant, API liefert direkt
            feasibleSolutions: result.feasibleWeightIds,
        };

        const job: SolverJob = {
            id: randomUUID(),
            type: 'solve-multiple',
            status: result.success ? 'completed' : 'failed',
            caseId,
            params,
            error: result.error,
            consoleOutput: result.consoleOutput,
            createdAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            duration: result.duration,
            metadata: {
                solutionsGenerated: result.feasibleCount,
                expectedSolutions: 3,
                feasibleSolutions: result.feasibleWeightIds,
            },
        };

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success) {
            throw new SolveUnknownError();
        }

        return { job, scheduleInfo, solutions: result.solutions };
    };
}
