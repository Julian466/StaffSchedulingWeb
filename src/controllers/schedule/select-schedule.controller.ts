import { makeSelectScheduleUseCase, ISelectScheduleUseCase } from '@/src/application/use-cases/schedule/select-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateScheduleId, validateMonthYear } from '@/src/entities/validation/input-validators';

export class SelectScheduleController {
  private readonly selectSchedule: ISelectScheduleUseCase;

  constructor(scheduleRepository: IScheduleRepository) {
    this.selectSchedule = makeSelectScheduleUseCase(scheduleRepository);
  }

  async execute(caseId: number, monthYear: string, scheduleId: string): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      validateScheduleId(scheduleId);
      await this.selectSchedule({ caseId, monthYear, scheduleId });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
