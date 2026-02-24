import { createGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/create-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class CreateGlobalWishesController {
  constructor(private readonly globalWishesRepository: IGlobalWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, entry: WishesAndBlockedEmployee): Promise<{ data: void } | { error: string }> {
    try {
      await createGlobalWishesUseCase(caseId, monthYear, entry, this.globalWishesRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
