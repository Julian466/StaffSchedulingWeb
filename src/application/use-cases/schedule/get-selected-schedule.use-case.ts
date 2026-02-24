import {ScheduleSolutionRaw} from '@/src/entities/models/schedule.model';
import {IScheduleRepository} from '@/src/application/ports/schedule.repository';

export interface IGetSelectedScheduleUseCase {
    (input: { caseId: number; monthYear: string }): Promise<ScheduleSolutionRaw | null>;
}

export function makeGetSelectedScheduleUseCase(
    scheduleRepository: IScheduleRepository
): IGetSelectedScheduleUseCase {
    return async ({caseId, monthYear}) => {
        return scheduleRepository.getSelectedSchedule(caseId, monthYear);
    };
}
