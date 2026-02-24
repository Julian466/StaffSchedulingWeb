import { ScheduleSolutionRaw, ScheduleMetadata } from '@/src/entities/models/schedule.model';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export interface ISaveScheduleUseCase {
  (input: { caseId: number; monthYear: string; scheduleId: string; solution: ScheduleSolutionRaw; description?: string }): Promise<ScheduleMetadata>;
}

export function makeSaveScheduleUseCase(
  scheduleRepository: IScheduleRepository
): ISaveScheduleUseCase {
  return async ({ caseId, monthYear, scheduleId, solution, description }) => {
    return scheduleRepository.save(caseId, monthYear, scheduleId, solution, description);
  };
}
