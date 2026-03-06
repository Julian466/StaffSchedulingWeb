import type {IGetSchedulesMetadataUseCase} from '@/src/application/use-cases/schedule/get-schedules-metadata.use-case';
import type {SchedulesMetadata} from '@/src/entities/models/schedule.model';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export interface IGetSchedulesMetadataController {
    (input: { caseId: number; monthYear: string }): Promise<
        { data: SchedulesMetadata } | { error: string }
    >;
}

export function makeGetSchedulesMetadataController(
    getSchedulesMetadataUseCase: IGetSchedulesMetadataUseCase
): IGetSchedulesMetadataController {
    return async ({caseId, monthYear}) => {
        try {
            validateMonthYear(monthYear);
            const metadata = await getSchedulesMetadataUseCase({caseId, monthYear});
            return {data: metadata};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
