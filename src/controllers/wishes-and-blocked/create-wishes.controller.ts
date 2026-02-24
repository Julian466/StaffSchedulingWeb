import { createWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/create-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class CreateWishesController {
  constructor(private readonly wishesRepository: IWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, entry: WishesAndBlockedEmployee): Promise<{ data: void } | { error: string }> {
    try {
      await createWishesUseCase(caseId, monthYear, entry, this.wishesRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
