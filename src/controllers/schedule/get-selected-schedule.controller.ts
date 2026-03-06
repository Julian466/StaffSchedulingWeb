import type {IGetSelectedScheduleUseCase} from '@/src/application/use-cases/schedule/get-selected-schedule.use-case';
import type {ScheduleSolutionRaw} from '@/src/entities/models/schedule.model';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export interface IGetSelectedScheduleController {
    (input: { caseId: number; monthYear: string }): Promise<
        { data: ScheduleSolutionRaw | null } | { error: string }
    >;
}

export function makeGetSelectedScheduleController(
    getSelectedScheduleUseCase: IGetSelectedScheduleUseCase
): IGetSelectedScheduleController {
    return async ({caseId, monthYear}) => {
        try {
            validateMonthYear(monthYear);
            const solution = await getSelectedScheduleUseCase({caseId, monthYear});
            return {data: solution};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
