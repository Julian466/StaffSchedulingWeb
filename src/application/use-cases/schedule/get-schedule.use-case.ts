import {ScheduleSolutionRaw} from '@/src/entities/models/schedule.model';
import {ScheduleNotFoundError} from '@/src/entities/errors/schedule.errors';
import {IScheduleRepository} from '@/src/application/ports/schedule.repository';

export interface IGetScheduleUseCase {
    (input: { caseId: number; monthYear: string; scheduleId: string }): Promise<ScheduleSolutionRaw>;
}

export function makeGetScheduleUseCase(
    scheduleRepository: IScheduleRepository
): IGetScheduleUseCase {
    return async ({caseId, monthYear, scheduleId}) => {
        const schedule = await scheduleRepository.getSchedule(caseId, monthYear, scheduleId);
        if (!schedule) throw new ScheduleNotFoundError(scheduleId);
        return schedule;
    };
}
