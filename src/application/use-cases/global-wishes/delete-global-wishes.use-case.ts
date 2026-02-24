import {IGlobalWishesAndBlockedRepository} from '@/src/application/ports/global-wishes-and-blocked.repository';

export interface IDeleteGlobalWishesUseCase {
    (input: { caseId: number; monthYear: string; key: number }): Promise<void>;
}

export function makeDeleteGlobalWishesUseCase(
    globalWishesRepository: IGlobalWishesAndBlockedRepository
): IDeleteGlobalWishesUseCase {
    return async ({caseId, monthYear, key}) => {
        return globalWishesRepository.delete(caseId, monthYear, key);
    };
}
