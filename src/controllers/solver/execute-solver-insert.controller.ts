import { z } from 'zod';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';
import { InsertParamsSchema } from '@/src/entities/models/solver.model';
import type { SolverJob } from '@/src/entities/models/solver.model';
import type { ScheduleSolutionRaw } from '@/src/entities/models/schedule.model';
import type { IExecuteSolverInsertUseCase } from '@/src/application/use-cases/solver/execute-solver-insert.use-case';

const InputSchema = z.object({
    caseId: z.number().int().positive(),
    monthYear: z.string(),
    params: InsertParamsSchema,
    solution: z.unknown().optional(),
});

export interface IExecuteSolverInsertController {
    (input: {
        caseId: number;
        monthYear: string;
        params: z.infer<typeof InsertParamsSchema>;
        solution?: ScheduleSolutionRaw;
    }): Promise<{ data: { job: SolverJob } } | { error: string }>;
}

export function makeExecuteSolverInsertController(
    executeUseCase: IExecuteSolverInsertUseCase
): IExecuteSolverInsertController {
    return async (rawInput) => {
        try {
            const { caseId, monthYear, params, solution } = InputSchema.parse(rawInput);
            validateMonthYear(monthYear);
            const result = await executeUseCase({
                caseId,
                monthYear,
                params,
                solution: solution as ScheduleSolutionRaw | undefined,
            });
            return { data: result };
        } catch (error) {
            if (isDomainError(error)) return { error: error.message };
            if (error instanceof z.ZodError) return { error: error.issues[0]?.message ?? 'Invalid input' };
            throw error;
        }
    };
}
