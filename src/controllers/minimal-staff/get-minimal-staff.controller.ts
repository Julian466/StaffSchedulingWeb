import { makeGetMinimalStaffUseCase, IGetMinimalStaffUseCase } from '@/src/application/use-cases/minimal-staff/get-minimal-staff.use-case';
import { IMinimalStaffRepository } from '@/src/application/ports/minimal-staff.repository';
import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetMinimalStaffController {
  private readonly getMinimalStaff: IGetMinimalStaffUseCase;

  constructor(minimalStaffRepository: IMinimalStaffRepository) {
    this.getMinimalStaff = makeGetMinimalStaffUseCase(minimalStaffRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: MinimalStaffRequirements } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const minimalStaff = await this.getMinimalStaff({ caseId, monthYear });
      return { data: minimalStaff };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
