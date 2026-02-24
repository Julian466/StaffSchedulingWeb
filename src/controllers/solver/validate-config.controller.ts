import type {IValidateConfigUseCase} from '@/src/application/use-cases/solver/validate-config.use-case';
import type {SolverConfigResult} from '@/src/application/ports/solver.service';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface IValidateConfigController {
    (): { data: SolverConfigResult } | { error: string };
}

export function makeValidateConfigController(
    validateConfigUseCase: IValidateConfigUseCase
): IValidateConfigController {
    return () => {
        try {
            const data = validateConfigUseCase();
            return {data};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
