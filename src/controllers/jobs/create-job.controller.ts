import type {ICreateJobUseCase} from '@/src/application/use-cases/jobs/create-job.use-case';
import type {SolverJob} from '@/src/entities/models/solver.model';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export interface ICreateJobController {
    (input: { caseId: number; monthYear: string; job: SolverJob }): Promise<
        { data: void } | { error: string }
    >;
}

export function makeCreateJobController(
    createJobUseCase: ICreateJobUseCase
): ICreateJobController {
    return async ({caseId, monthYear, job}) => {
        try {
            validateMonthYear(monthYear);
            await createJobUseCase({caseId, monthYear, job});
            return {data: undefined};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
