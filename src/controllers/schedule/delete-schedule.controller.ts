import { makeDeleteScheduleUseCase, IDeleteScheduleUseCase } from '@/src/application/use-cases/schedule/delete-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateScheduleId, validateMonthYear } from '@/src/entities/validation/input-validators';

export class DeleteScheduleController {
  private readonly deleteSchedule: IDeleteScheduleUseCase;

  constructor(scheduleRepository: IScheduleRepository) {
    this.deleteSchedule = makeDeleteScheduleUseCase(scheduleRepository);
  }

  async execute(caseId: number, monthYear: string, scheduleId: string): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      validateScheduleId(scheduleId);
      await this.deleteSchedule({ caseId, monthYear, scheduleId });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
