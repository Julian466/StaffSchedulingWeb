import { makeGetSchedulesMetadataUseCase, IGetSchedulesMetadataUseCase } from '@/src/application/use-cases/schedule/get-schedules-metadata.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { SchedulesMetadata } from '@/src/entities/models/schedule.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetSchedulesMetadataController {
  private readonly getSchedulesMetadata: IGetSchedulesMetadataUseCase;

  constructor(scheduleRepository: IScheduleRepository) {
    this.getSchedulesMetadata = makeGetSchedulesMetadataUseCase(scheduleRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: SchedulesMetadata } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const metadata = await this.getSchedulesMetadata({ caseId, monthYear });
      return { data: metadata };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
