import { deleteGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/delete-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class DeleteGlobalWishesController {
  constructor(private readonly globalWishesRepository: IGlobalWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: void } | { error: string }> {
    try {
      await deleteGlobalWishesUseCase(caseId, monthYear, key, this.globalWishesRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
