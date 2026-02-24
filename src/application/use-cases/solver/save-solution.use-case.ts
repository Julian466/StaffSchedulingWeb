import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IScheduleRepository} from '@/src/application/ports/schedule.repository';

export interface SaveSolutionResult {
    success: boolean;
    filename: string;
    path: string;
}

export interface ISaveSolutionUseCase {
    (input: {
        caseId: number;
        monthYear: string;
        start: string;
        end: string;
    }): Promise<SaveSolutionResult>;
}

function formatDateForFilename(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function makeSaveSolutionUseCase(
    solverService: ISolverService,
    scheduleRepository: IScheduleRepository
): ISaveSolutionUseCase {
    return async ({caseId, monthYear, start, end}) => {
        if (!start || !end) {
            throw new Error('start and end dates are required');
        }

        const selectedSchedule = await scheduleRepository.getSelectedSchedule(caseId, monthYear);
        if (!selectedSchedule) {
            throw new Error('No schedule is currently selected');
        }

        const formattedStart = formatDateForFilename(start);
        const formattedEnd = formatDateForFilename(end);
        const filename = `solution_${caseId}_${formattedStart}-${formattedEnd}.json`;

        await solverService.writeSolutionFile(filename, selectedSchedule);

        const fileInfo = solverService.findSolutionFile(filename);

        return {
            success: true,
            filename,
            path: fileInfo.path ?? filename,
        };
    };
}
