import { ICaseRepository } from '@/src/application/ports/case.repository';

export async function createCaseUseCase(
  caseId: number,
  month: number,
  year: number,
  caseRepository: ICaseRepository
): Promise<void> {
  return caseRepository.create(caseId, month, year);
}
