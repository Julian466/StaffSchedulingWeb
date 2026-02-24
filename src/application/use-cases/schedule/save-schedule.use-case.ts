import { ScheduleSolutionRaw, ScheduleMetadata } from '@/src/entities/models/schedule.model';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export async function saveScheduleUseCase(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  solution: ScheduleSolutionRaw,
  scheduleRepository: IScheduleRepository,
  description?: string
): Promise<ScheduleMetadata> {
  return scheduleRepository.save(caseId, monthYear, scheduleId, solution, description);
}
