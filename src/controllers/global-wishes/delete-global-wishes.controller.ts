import { makeDeleteGlobalWishesUseCase, IDeleteGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/delete-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class DeleteGlobalWishesController {
  private readonly deleteGlobalWishes: IDeleteGlobalWishesUseCase;

  constructor(globalWishesRepository: IGlobalWishesAndBlockedRepository) {
    this.deleteGlobalWishes = makeDeleteGlobalWishesUseCase(globalWishesRepository);
  }

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.deleteGlobalWishes({ caseId, monthYear, key });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
