import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export async function selectScheduleUseCase(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  scheduleRepository: IScheduleRepository
): Promise<void> {
  return scheduleRepository.select(caseId, monthYear, scheduleId);
}
