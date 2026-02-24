import { makeSaveScheduleUseCase, ISaveScheduleUseCase } from '@/src/application/use-cases/schedule/save-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { ScheduleSolutionRaw, ScheduleMetadata } from '@/src/entities/models/schedule.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateScheduleId, validateMonthYear } from '@/src/entities/validation/input-validators';

export class SaveScheduleController {
  private readonly saveSchedule: ISaveScheduleUseCase;

  constructor(scheduleRepository: IScheduleRepository) {
    this.saveSchedule = makeSaveScheduleUseCase(scheduleRepository);
  }

  async execute(
    caseId: number,
    monthYear: string,
    scheduleId: string,
    solution: ScheduleSolutionRaw,
    description?: string
  ): Promise<{ data: ScheduleMetadata } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      validateScheduleId(scheduleId);
      const metadata = await this.saveSchedule({ caseId, monthYear, scheduleId, solution, description });
      return { data: metadata };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
