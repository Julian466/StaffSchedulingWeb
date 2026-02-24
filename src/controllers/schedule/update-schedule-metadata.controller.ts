import type {
    IUpdateScheduleMetadataUseCase
} from '@/src/application/use-cases/schedule/update-schedule-metadata.use-case';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear, validateScheduleId} from '@/src/entities/validation/input-validators';

export interface IUpdateScheduleMetadataController {
    (input: {
        caseId: number;
        monthYear: string;
        scheduleId: string;
        updates: { description?: string; comment?: string };
    }): Promise<{ data: void } | { error: string }>;
}

export function makeUpdateScheduleMetadataController(
    updateScheduleMetadataUseCase: IUpdateScheduleMetadataUseCase
): IUpdateScheduleMetadataController {
    return async ({caseId, monthYear, scheduleId, updates}) => {
        try {
            validateMonthYear(monthYear);
            validateScheduleId(scheduleId);
            await updateScheduleMetadataUseCase({caseId, monthYear, scheduleId, updates});
            return {data: undefined};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
