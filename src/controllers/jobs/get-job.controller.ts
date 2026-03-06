import type {IGetJobUseCase} from '@/src/application/use-cases/jobs/get-job.use-case';
import type {SolverJob} from '@/src/entities/models/solver.model';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export interface IGetJobController {
    (input: { caseId: number; monthYear: string; jobId: string }): Promise<
        { data: SolverJob } | { error: string }
    >;
}

export function makeGetJobController(
    getJobUseCase: IGetJobUseCase
): IGetJobController {
    return async ({caseId, monthYear, jobId}) => {
        try {
            validateMonthYear(monthYear);
            const job = await getJobUseCase({caseId, monthYear, jobId});
            return {data: job};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
