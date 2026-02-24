import { getScheduleUseCase } from '@/src/application/use-cases/schedule/get-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class GetScheduleController {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(caseId: number, monthYear: string, scheduleId: string): Promise<{ data: ScheduleSolutionRaw } | { error: string }> {
    try {
      const schedule = await getScheduleUseCase(caseId, monthYear, scheduleId, this.scheduleRepository);
      return { data: schedule };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
