import type { ICreateCaseUseCase } from '@/src/application/use-cases/cases/create-case.use-case';
import { isDomainError } from '@/src/entities/errors/base.errors';

export interface ICreateCaseController {
  (input: { caseId: number; month: number; year: number }): Promise<
    { data: void } | { error: string }
  >;
}

export function makeCreateCaseController(
  createCaseUseCase: ICreateCaseUseCase
): ICreateCaseController {
  return async ({ caseId, month, year }) => {
    try {
      await createCaseUseCase({ caseId, month, year });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) return { error: error.message };
      throw error;
    }
  };
}
