import { makeCreateGlobalWishesUseCase, ICreateGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/create-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class CreateGlobalWishesController {
  private readonly createGlobalWishes: ICreateGlobalWishesUseCase;

  constructor(globalWishesRepository: IGlobalWishesAndBlockedRepository) {
    this.createGlobalWishes = makeCreateGlobalWishesUseCase(globalWishesRepository);
  }

  async execute(caseId: number, monthYear: string, entry: WishesAndBlockedEmployee): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.createGlobalWishes({ caseId, monthYear, entry });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
