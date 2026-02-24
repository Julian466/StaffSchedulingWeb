import type {IDeleteWishesUseCase} from '@/src/application/use-cases/wishes-and-blocked/delete-wishes.use-case';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export interface IDeleteWishesController {
    (input: { caseId: number; monthYear: string; key: number }): Promise<
        { data: void } | { error: string }
    >;
}

export function makeDeleteWishesController(
    deleteWishesUseCase: IDeleteWishesUseCase
): IDeleteWishesController {
    return async ({caseId, monthYear, key}) => {
        try {
            validateMonthYear(monthYear);
            await deleteWishesUseCase({caseId, monthYear, key});
            return {data: undefined};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
