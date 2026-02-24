import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export async function deleteScheduleUseCase(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  scheduleRepository: IScheduleRepository
): Promise<void> {
  return scheduleRepository.delete(caseId, monthYear, scheduleId);
}
