import { getWishesByKeyUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-wishes-by-key.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetWishesByKeyController {
  constructor(private readonly wishesRepository: IWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: WishesAndBlockedEmployee } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const wishes = await getWishesByKeyUseCase(caseId, monthYear, key, this.wishesRepository);
      return { data: wishes };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
