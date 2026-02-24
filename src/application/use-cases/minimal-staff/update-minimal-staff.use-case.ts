import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { IMinimalStaffRepository } from '@/src/application/ports/minimal-staff.repository';

export async function updateMinimalStaffUseCase(
  caseId: number,
  monthYear: string,
  data: MinimalStaffRequirements,
  minimalStaffRepository: IMinimalStaffRepository
): Promise<void> {
  return minimalStaffRepository.update(caseId, monthYear, data);
}
