import type {ISolverService} from '@/src/application/ports/solver.service';

export interface IFindSolutionFileUseCase {
    (input: { filename: string }): { exists: boolean; path?: string };
}

export function makeFindSolutionFileUseCase(
    solverService: ISolverService
): IFindSolutionFileUseCase {
    return ({filename}) => {
        if (!filename) {
            throw new Error('Filename parameter is required');
        }
        return solverService.findSolutionFile(filename);
    };
}
