import { getMinimalStaffUseCase } from '@/src/application/use-cases/minimal-staff/get-minimal-staff.use-case';
import { IMinimalStaffRepository } from '@/src/application/ports/minimal-staff.repository';
import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class GetMinimalStaffController {
  constructor(private readonly minimalStaffRepository: IMinimalStaffRepository) {}

  async execute(caseId: number, monthYear: string): Promise<{ data: MinimalStaffRequirements } | { error: string }> {
    try {
      const minimalStaff = await getMinimalStaffUseCase(caseId, monthYear, this.minimalStaffRepository);
      return { data: minimalStaff };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
