import { CaseUnit } from '@/src/entities/models/case.model';
import { ICaseRepository } from '@/src/application/ports/case.repository';

export async function listCasesUseCase(
  caseRepository: ICaseRepository
): Promise<CaseUnit[]> {
  return caseRepository.list();
}
