import { listCasesUseCase } from '@/src/application/use-cases/cases/list-cases.use-case';
import { ICaseRepository } from '@/src/application/ports/case.repository';
import { CaseUnit } from '@/src/entities/models/case.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class ListCasesController {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(): Promise<{ data: CaseUnit[] } | { error: string }> {
    try {
      const cases = await listCasesUseCase(this.caseRepository);
      return { data: cases };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
