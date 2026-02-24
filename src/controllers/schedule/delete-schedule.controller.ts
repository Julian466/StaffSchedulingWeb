import { deleteScheduleUseCase } from '@/src/application/use-cases/schedule/delete-schedule.use-case';
import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class DeleteScheduleController {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(caseId: number, monthYear: string, scheduleId: string): Promise<{ data: void } | { error: string }> {
    try {
      await deleteScheduleUseCase(caseId, monthYear, scheduleId, this.scheduleRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
