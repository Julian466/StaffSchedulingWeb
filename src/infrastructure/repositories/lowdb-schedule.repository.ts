import { IScheduleRepository } from '@/src/application/ports/schedule.repository';
import {
  SchedulesMetadata,
  ScheduleSolutionRaw,
  ScheduleMetadata,
} from '@/src/entities/models/schedule.model';
import {
  getSchedulesMetadataDb,
  getScheduleDb,
  deleteSchedule,
} from '@/src/infrastructure/persistence/lowdb/schedule.db';

export class LowdbScheduleRepository implements IScheduleRepository {
  async getMetadata(caseId: number, monthYear: string): Promise<SchedulesMetadata> {
    const db = await getSchedulesMetadataDb(caseId, monthYear);
    return db.data;
  }

  async getSchedule(caseId: number, monthYear: string, scheduleId: string): Promise<ScheduleSolutionRaw | null> {
    const db = await getScheduleDb(caseId, monthYear, scheduleId);
    return db.data.solution;
  }

  async save(
    caseId: number,
    monthYear: string,
    scheduleId: string,
    solution: ScheduleSolutionRaw,
    description?: string,
  ): Promise<ScheduleMetadata> {
    // Save the schedule solution
    const scheduleDb = await getScheduleDb(caseId, monthYear, scheduleId);
    scheduleDb.data.solution = solution;
    await scheduleDb.write();

    // Build metadata entry
    const metadata: ScheduleMetadata = {
      scheduleId,
      description,
      generatedAt: new Date().toISOString(),
      isSelected: false,
      stats: solution.stats,
    };

    // Update the schedules metadata
    const metaDb = await getSchedulesMetadataDb(caseId, monthYear);
    const existing = metaDb.data.schedules.findIndex((s) => s.scheduleId === scheduleId);
    if (existing !== -1) {
      metaDb.data.schedules[existing] = metadata;
    } else {
      metaDb.data.schedules.push(metadata);
    }
    await metaDb.write();

    return metadata;
  }

  async delete(caseId: number, monthYear: string, scheduleId: string): Promise<void> {
    // Delete the schedule file
    await deleteSchedule(caseId, monthYear, scheduleId);

    // Remove from metadata
    const metaDb = await getSchedulesMetadataDb(caseId, monthYear);
    metaDb.data.schedules = metaDb.data.schedules.filter((s) => s.scheduleId !== scheduleId);

    // Clear selection if this was the selected schedule
    if (metaDb.data.selectedScheduleId === scheduleId) {
      metaDb.data.selectedScheduleId = null;
    }
    await metaDb.write();
  }

  async select(caseId: number, monthYear: string, scheduleId: string): Promise<void> {
    const metaDb = await getSchedulesMetadataDb(caseId, monthYear);

    // Update isSelected flags
    for (const schedule of metaDb.data.schedules) {
      schedule.isSelected = schedule.scheduleId === scheduleId;
    }
    metaDb.data.selectedScheduleId = scheduleId;
    await metaDb.write();
  }

  async updateMetadata(
    caseId: number,
    monthYear: string,
    scheduleId: string,
    updates: { description?: string; comment?: string },
  ): Promise<void> {
    const metaDb = await getSchedulesMetadataDb(caseId, monthYear);
    const schedule = metaDb.data.schedules.find((s) => s.scheduleId === scheduleId);
    if (schedule) {
      if (updates.description !== undefined) schedule.description = updates.description;
      if (updates.comment !== undefined) schedule.comment = updates.comment;
      await metaDb.write();
    }
  }
}
