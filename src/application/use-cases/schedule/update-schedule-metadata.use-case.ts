import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export async function updateScheduleMetadataUseCase(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  updates: { description?: string; comment?: string },
  scheduleRepository: IScheduleRepository
): Promise<void> {
  return scheduleRepository.updateMetadata(caseId, monthYear, scheduleId, updates);
}
