import type { IUpdateMinimalStaffUseCase } from '@/src/application/use-cases/minimal-staff/update-minimal-staff.use-case';
import type { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export interface IUpdateMinimalStaffController {
  (input: { caseId: number; monthYear: string; data: MinimalStaffRequirements }): Promise<
    { data: void } | { error: string }
  >;
}

export function makeUpdateMinimalStaffController(
  updateMinimalStaffUseCase: IUpdateMinimalStaffUseCase
): IUpdateMinimalStaffController {
  return async ({ caseId, monthYear, data }) => {
    try {
      validateMonthYear(monthYear);
      await updateMinimalStaffUseCase({ caseId, monthYear, data });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) return { error: error.message };
      throw error;
    }
  };
}
