import type {ISolverService, SolverConfigResult} from '@/src/application/ports/solver.service';

export interface IValidateConfigUseCase {
    (): SolverConfigResult;
}

export function makeValidateConfigUseCase(
    solverService: ISolverService
): IValidateConfigUseCase {
    return () => {
        return solverService.validateConfig();
    };
}
