import { deleteWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/delete-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class DeleteWishesController {
  constructor(private readonly wishesRepository: IWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: void } | { error: string }> {
    try {
      await deleteWishesUseCase(caseId, monthYear, key, this.wishesRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
