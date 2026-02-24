import { makeUpdateMinimalStaffUseCase, IUpdateMinimalStaffUseCase } from '@/src/application/use-cases/minimal-staff/update-minimal-staff.use-case';
import { IMinimalStaffRepository } from '@/src/application/ports/minimal-staff.repository';
import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateMinimalStaffController {
  private readonly updateMinimalStaff: IUpdateMinimalStaffUseCase;

  constructor(minimalStaffRepository: IMinimalStaffRepository) {
    this.updateMinimalStaff = makeUpdateMinimalStaffUseCase(minimalStaffRepository);
  }

  async execute(caseId: number, monthYear: string, data: MinimalStaffRequirements): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.updateMinimalStaff({ caseId, monthYear, data });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
