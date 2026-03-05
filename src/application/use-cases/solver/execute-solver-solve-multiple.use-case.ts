import {randomUUID} from 'crypto';
import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {SolveMultipleParams, SolveMultipleScheduleInfo, SolverJob} from '@/src/entities/models/solver.model';

export type { SolveMultipleScheduleInfo };

export interface IExecuteSolverSolveMultipleUseCase {
    (input: {
        caseId: number;
        monthYear: string;
        params: SolveMultipleParams;
    }): Promise<{ job: SolverJob; scheduleInfo: SolveMultipleScheduleInfo }>;
}

export function makeExecuteSolverSolveMultipleUseCase(
    solverService: ISolverService,
    jobRepository: IJobRepository
): IExecuteSolverSolveMultipleUseCase {
    return async ({caseId, monthYear, params}) => {
        const startTime = Date.now();
        const result = solverService.runSolveMultiple(params);
        const duration = Date.now() - startTime;

        // Parse CLI output to extract information about generated schedules
        const scheduleInfo: SolveMultipleScheduleInfo = {
            solutionsGenerated: 0,
            scheduleFiles: [],
            feasibleSolutions: [],
        };

        if (result.success) {
            const output = result.consoleOutput;

            const feasibleMatches = output.match(/- status\s+:\s+FEASIBLE/g);
            if (feasibleMatches) {
                scheduleInfo.solutionsGenerated = feasibleMatches.length;
                scheduleInfo.feasibleSolutions = Array.from(
                    {length: feasibleMatches.length},
                    (_, i) => i
                );
            }

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

        await jobRepository.create(caseId, monthYear, job);

        if (!result.success) {
            throw new Error(`Solve-multiple command failed: ${result.consoleOutput}`);
        }

        return {job, scheduleInfo};
    };
}
