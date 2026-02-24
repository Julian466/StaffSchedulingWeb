import type {ICreateGlobalWishesUseCase} from '@/src/application/use-cases/global-wishes/create-global-wishes.use-case';
import type {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export interface ICreateGlobalWishesController {
    (input: { caseId: number; monthYear: string; entry: WishesAndBlockedEmployee }): Promise<
        { data: void } | { error: string }
    >;
}

export function makeCreateGlobalWishesController(
    createGlobalWishesUseCase: ICreateGlobalWishesUseCase
): ICreateGlobalWishesController {
    return async ({caseId, monthYear, entry}) => {
        try {
            validateMonthYear(monthYear);
            await createGlobalWishesUseCase({caseId, monthYear, entry});
            return {data: undefined};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
