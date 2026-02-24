import {ScheduleMetadata, SchedulesMetadata, ScheduleSolutionRaw,} from '@/src/entities/models/schedule.model';

export interface IScheduleRepository {
    getMetadata(caseId: number, monthYear: string): Promise<SchedulesMetadata>;

    getSchedule(caseId: number, monthYear: string, scheduleId: string): Promise<ScheduleSolutionRaw | null>;

    save(caseId: number, monthYear: string, scheduleId: string, solution: ScheduleSolutionRaw, description?: string): Promise<ScheduleMetadata>;

    delete(caseId: number, monthYear: string, scheduleId: string): Promise<void>;

    select(caseId: number, monthYear: string, scheduleId: string): Promise<void>;

    updateMetadata(caseId: number, monthYear: string, scheduleId: string, updates: {
        description?: string;
        comment?: string
    }): Promise<void>;
}
