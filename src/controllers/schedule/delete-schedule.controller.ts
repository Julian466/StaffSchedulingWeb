import type { IDeleteScheduleUseCase } from '@/src/application/use-cases/schedule/delete-schedule.use-case';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateScheduleId, validateMonthYear } from '@/src/entities/validation/input-validators';

export interface IDeleteScheduleController {
  (input: { caseId: number; monthYear: string; scheduleId: string }): Promise<
    { data: void } | { error: string }
  >;
}

export function makeDeleteScheduleController(
  deleteScheduleUseCase: IDeleteScheduleUseCase
): IDeleteScheduleController {
  return async ({ caseId, monthYear, scheduleId }) => {
    try {
      validateMonthYear(monthYear);
      validateScheduleId(scheduleId);
      await deleteScheduleUseCase({ caseId, monthYear, scheduleId });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) return { error: error.message };
      throw error;
    }
  };
}
