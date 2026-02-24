import { SchedulesMetadata } from '@/src/entities/models/schedule.model';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';

export async function getSchedulesMetadataUseCase(
  caseId: number,
  monthYear: string,
  scheduleRepository: IScheduleRepository
): Promise<SchedulesMetadata> {
  return scheduleRepository.getMetadata(caseId, monthYear);
}
