import type { IListCasesUseCase } from '@/src/application/use-cases/cases/list-cases.use-case';
import type { CaseUnit } from '@/src/entities/models/case.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export interface IListCasesController {
  (): Promise<{ data: CaseUnit[] } | { error: string }>;
}

export function makeListCasesController(
  listCasesUseCase: IListCasesUseCase
): IListCasesController {
  return async () => {
    try {
      const cases = await listCasesUseCase();
      return { data: cases };
    } catch (error) {
      if (isDomainError(error)) return { error: error.message };
      throw error;
    }
  };
}
