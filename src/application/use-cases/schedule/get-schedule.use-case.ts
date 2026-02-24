import { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';
import { ScheduleNotFoundError } from '@/src/entities/errors/schedule.errors';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export async function getScheduleUseCase(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  scheduleRepository: IScheduleRepository
): Promise<ScheduleSolutionRaw> {
  const schedule = await scheduleRepository.getSchedule(caseId, monthYear, scheduleId);
  if (!schedule) throw new ScheduleNotFoundError(scheduleId);
  return schedule;
}
