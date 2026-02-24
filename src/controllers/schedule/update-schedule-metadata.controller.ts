import { makeUpdateScheduleMetadataUseCase, IUpdateScheduleMetadataUseCase } from '@/src/application/use-cases/schedule/update-schedule-metadata.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateScheduleId, validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateScheduleMetadataController {
  private readonly updateScheduleMetadata: IUpdateScheduleMetadataUseCase;

  constructor(scheduleRepository: IScheduleRepository) {
    this.updateScheduleMetadata = makeUpdateScheduleMetadataUseCase(scheduleRepository);
  }

  async execute(
    caseId: number,
    monthYear: string,
    scheduleId: string,
    updates: { description?: string; comment?: string }
  ): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      validateScheduleId(scheduleId);
      await this.updateScheduleMetadata({ caseId, monthYear, scheduleId, updates });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
