import { updateGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/update-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateGlobalWishesController {
  constructor(private readonly globalWishesRepository: IGlobalWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, key: number, data: Partial<WishesAndBlockedEmployee>): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await updateGlobalWishesUseCase(caseId, monthYear, key, data, this.globalWishesRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
