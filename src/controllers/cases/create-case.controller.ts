import { createCaseUseCase } from '@/src/application/use-cases/cases/create-case.use-case';
import { ICaseRepository } from '@/src/application/ports/case.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class CreateCaseController {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(caseId: number, month: number, year: number): Promise<{ data: void } | { error: string }> {
    try {
      await createCaseUseCase(caseId, month, year, this.caseRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
