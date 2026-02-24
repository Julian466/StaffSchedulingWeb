import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { IMinimalStaffRepository } from '@/src/application/ports/minimal-staff.repository';

export async function getMinimalStaffUseCase(
  caseId: number,
  monthYear: string,
  minimalStaffRepository: IMinimalStaffRepository
): Promise<MinimalStaffRequirements> {
  return minimalStaffRepository.get(caseId, monthYear);
}
