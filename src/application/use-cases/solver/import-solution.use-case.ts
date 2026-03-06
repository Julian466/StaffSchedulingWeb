import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IScheduleRepository} from '@/src/application/ports/schedule.repository';
import type {ImportSolutionResult} from '@/src/entities/models/solver.model';

export type { ImportSolutionResult };

export interface ImportSolutionInput {
    caseId: number;
    monthYear: string;
    start: string;
    end: string;
    solutionType: string;
}

export interface IImportSolutionUseCase {
    (input: ImportSolutionInput): Promise<ImportSolutionResult>;
}

function formatDateForFilename(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function makeImportSolutionUseCase(
    solverService: ISolverService,
    scheduleRepository: IScheduleRepository
): IImportSolutionUseCase {
    return async ({caseId, monthYear, start, end, solutionType}) => {
        if (!start || !end || !solutionType) {
            throw new Error('Missing required fields: start, end, solutionType');
        }

        const startFormatted = formatDateForFilename(start);
        const endFormatted = formatDateForFilename(end);
        const filename = `solution_${caseId}_${startFormatted}-${endFormatted}_${solutionType}_processed.json`;

        let solution;
        try {
            solution = solverService.readProcessedSolutionFile(filename);
        } catch {
            throw new Error(`Solution file not found. Expected file: ${filename}`);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const scheduleId = `imported_${solutionType}_${timestamp}`;
        const description = `Automatisch importiert: ${solutionType} (${startFormatted} bis ${endFormatted})`;

        await scheduleRepository.save(caseId, monthYear, scheduleId, solution, description);
        await scheduleRepository.select(caseId, monthYear, scheduleId);

        return {
            success: true,
            scheduleId,
            filename,
            message: 'Solution imported successfully',
        };
    };
}
