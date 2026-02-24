import { updateScheduleMetadataUseCase } from '@/src/application/use-cases/schedule/update-schedule-metadata.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class UpdateScheduleMetadataController {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(
    caseId: number,
    monthYear: string,
    scheduleId: string,
    updates: { description?: string; comment?: string }
  ): Promise<{ data: void } | { error: string }> {
    try {
      await updateScheduleMetadataUseCase(caseId, monthYear, scheduleId, updates, this.scheduleRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
