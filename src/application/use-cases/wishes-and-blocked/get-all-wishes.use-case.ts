import {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';
import {IWishesAndBlockedRepository} from '@/src/application/ports/wishes-and-blocked.repository';

export interface IGetAllWishesUseCase {
    (input: { caseId: number; monthYear: string }): Promise<WishesAndBlockedEmployee[]>;
}

export function makeGetAllWishesUseCase(
    wishesRepository: IWishesAndBlockedRepository
): IGetAllWishesUseCase {
    return async ({caseId, monthYear}) => {
        return wishesRepository.getAll(caseId, monthYear);
    };
}
