import { makeCreateCaseUseCase, ICreateCaseUseCase } from '@/src/application/use-cases/cases/create-case.use-case';
import { ICaseRepository } from '@/src/application/ports/case.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class CreateCaseController {
  private readonly createCase: ICreateCaseUseCase;

  constructor(caseRepository: ICaseRepository) {
    this.createCase = makeCreateCaseUseCase(caseRepository);
  }

  async execute(caseId: number, month: number, year: number): Promise<{ data: void } | { error: string }> {
    try {
      await this.createCase({ caseId, month, year });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
