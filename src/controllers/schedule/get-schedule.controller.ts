import { makeGetScheduleUseCase, IGetScheduleUseCase } from '@/src/application/use-cases/schedule/get-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateScheduleId, validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetScheduleController {
  private readonly getSchedule: IGetScheduleUseCase;

  constructor(scheduleRepository: IScheduleRepository) {
    this.getSchedule = makeGetScheduleUseCase(scheduleRepository);
  }

  async execute(caseId: number, monthYear: string, scheduleId: string): Promise<{ data: ScheduleSolutionRaw } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      validateScheduleId(scheduleId);
      const schedule = await this.getSchedule({ caseId, monthYear, scheduleId });
      return { data: schedule };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
