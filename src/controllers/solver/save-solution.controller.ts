import {z} from 'zod';
import {isDomainError} from '@/src/entities/errors/base.errors';
import {validateMonthYear} from '@/src/entities/validation/input-validators';
import type {ISaveSolutionUseCase, SaveSolutionResult} from '@/src/application/use-cases/solver/save-solution.use-case';

const InputSchema = z.object({
    caseId: z.number().int().positive(),
    monthYear: z.string(),
    start: z.string().min(1, 'start date is required'),
    end: z.string().min(1, 'end date is required'),
});

export interface ISaveSolutionController {
    (input: {
        caseId: number;
        monthYear: string;
        start: string;
        end: string;
    }): Promise<{ data: SaveSolutionResult } | { error: string }>;
}

export function makeSaveSolutionController(
    saveSolutionUseCase: ISaveSolutionUseCase
): ISaveSolutionController {
    return async (rawInput) => {
        try {
            const {caseId, monthYear, start, end} = InputSchema.parse(rawInput);
            validateMonthYear(monthYear);
            const result = await saveSolutionUseCase({caseId, monthYear, start, end});
            return {data: result};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            if (error instanceof z.ZodError) return {error: error.issues[0]?.message ?? 'Invalid input'};
            throw error;
        }
    };
}
