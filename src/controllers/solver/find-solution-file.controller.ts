import {z} from 'zod';
import {isDomainError} from '@/src/entities/errors/base.errors';
import type {IFindSolutionFileUseCase} from '@/src/application/use-cases/solver/find-solution-file.use-case';

const InputSchema = z.object({
    filename: z.string().min(1, 'Filename is required'),
});

export interface IFindSolutionFileController {
    (input: { filename: string }): { data: { exists: boolean; path?: string } } | { error: string };
}

export function makeFindSolutionFileController(
    findSolutionFileUseCase: IFindSolutionFileUseCase
): IFindSolutionFileController {
    return (rawInput) => {
        try {
            const {filename} = InputSchema.parse(rawInput);
            const result = findSolutionFileUseCase({filename});
            return {data: result};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            if (error instanceof z.ZodError) return {error: error.issues[0]?.message ?? 'Invalid input'};
            throw error;
        }
    };
}
