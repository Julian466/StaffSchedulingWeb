import { saveScheduleUseCase } from '@/src/application/use-cases/schedule/save-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { ScheduleSolutionRaw, ScheduleMetadata } from '@/src/entities/models/schedule.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class SaveScheduleController {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(
    caseId: number,
    monthYear: string,
    scheduleId: string,
    solution: ScheduleSolutionRaw,
    description?: string
  ): Promise<{ data: ScheduleMetadata } | { error: string }> {
    try {
      const metadata = await saveScheduleUseCase(caseId, monthYear, scheduleId, solution, this.scheduleRepository, description);
      return { data: metadata };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
