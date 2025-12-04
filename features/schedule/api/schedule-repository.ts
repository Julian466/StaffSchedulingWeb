import { ScheduleDatabase, ScheduleSolutionRaw, SchedulesMetadata, ScheduleMetadata } from '@/types/schedule';
import { getScheduleDb, getSchedulesMetadataDb, listScheduleIds, deleteSchedule as deleteScheduleFile } from '@/lib/data/schedule/db-schedule';
import { RepositoryError } from '@/lib/errors/repository-errors';
import { logger } from '@/lib/logging/logger';

/**
 * Repository for schedule data persistence.
 * Handles reading and writing schedule solutions to the file system.
 * Supports multiple schedules per case with seed-based generation.
 */
export class ScheduleRepository {
  /**
   * Gets all schedule metadata for a specific case.
   * 
   * @param caseId - The case ID to get schedules for
   * @returns The schedules metadata
   * @throws RepositoryError if the data cannot be read
   */
  static async getSchedulesMetadata(caseId: number): Promise<SchedulesMetadata> {
    try {
      const db = await getSchedulesMetadataDb(caseId);
      return db.data;
    } catch (error) {
      logger.error('Failed to read schedules metadata', { caseId, error });
      throw new RepositoryError('Failed to read schedules metadata');
    }
  }

  /**
   * Gets a specific schedule solution.
   * 
   * @param caseId - The case ID
   * @param scheduleId - The schedule ID to get
   * @returns The schedule solution or null if not found
   * @throws RepositoryError if the file cannot be read
   */
  static async getSchedule(caseId: number, scheduleId: string): Promise<ScheduleSolutionRaw | null> {
    try {
      const db = await getScheduleDb(caseId, scheduleId);
      return db.data.solution;
    } catch (error) {
      logger.error('Failed to read schedule', { caseId, scheduleId, error });
      throw new RepositoryError('Failed to read schedule');
    }
  }

  /**
   * Gets the currently selected schedule for a case.
   * 
   * @param caseId - The case ID
   * @returns The selected schedule solution or null if none selected
   * @throws RepositoryError if the data cannot be read
   */
  static async getSelectedSchedule(caseId: number): Promise<ScheduleSolutionRaw | null> {
    try {
      const metadata = await this.getSchedulesMetadata(caseId);
      if (!metadata.selectedScheduleId) {
        return null;
      }
      return await this.getSchedule(caseId, metadata.selectedScheduleId);
    } catch (error) {
      logger.error('Failed to read selected schedule', { caseId, error });
      throw new RepositoryError('Failed to read selected schedule');
    }
  }

  /**
   * Saves a new schedule solution with metadata.
   * 
   * @param caseId - The case ID
   * @param scheduleId - Unique ID for this schedule (e.g., timestamp or UUID)
   * @param seed - The seed used to generate this schedule
   * @param solution - The schedule solution to save
   * @param autoSelect - Whether to automatically select this schedule (default: false)
   * @throws RepositoryError if the data cannot be written
   */
  static async saveSchedule(
    caseId: number,
    scheduleId: string,
    seed: number,
    solution: ScheduleSolutionRaw,
    autoSelect: boolean = false
  ): Promise<void> {
    try {
      // Save the schedule data
      const db = await getScheduleDb(caseId, scheduleId);
      db.data.solution = solution;
      await db.write();

      // Update metadata
      const metadataDb = await getSchedulesMetadataDb(caseId);
      
      // Check if schedule already exists
      const existingIndex = metadataDb.data.schedules.findIndex(s => s.scheduleId === scheduleId);
      
      const scheduleMetadata: ScheduleMetadata = {
        scheduleId,
        seed,
        generatedAt: new Date().toISOString(),
        isSelected: autoSelect,
        stats: solution.stats,
      };

      if (existingIndex >= 0) {
        // Update existing
        metadataDb.data.schedules[existingIndex] = {
          ...metadataDb.data.schedules[existingIndex],
          ...scheduleMetadata,
        };
      } else {
        // Add new
        metadataDb.data.schedules.push(scheduleMetadata);
      }

      // If autoSelect, update the selected schedule ID
      if (autoSelect) {
        // Deselect all others
        metadataDb.data.schedules.forEach(s => {
          if (s.scheduleId !== scheduleId) {
            s.isSelected = false;
          }
        });
        metadataDb.data.selectedScheduleId = scheduleId;
      }

      await metadataDb.write();
      logger.info('Schedule saved successfully', { caseId, scheduleId, seed, autoSelect });
    } catch (error) {
      logger.error('Failed to save schedule', { caseId, scheduleId, error });
      throw new RepositoryError('Failed to save schedule');
    }
  }

  /**
   * Selects a schedule as the active one.
   * 
   * @param caseId - The case ID
   * @param scheduleId - The schedule ID to select
   * @throws RepositoryError if the data cannot be updated
   */
  static async selectSchedule(caseId: number, scheduleId: string): Promise<void> {
    try {
      const db = await getSchedulesMetadataDb(caseId);
      
      // Deselect all schedules
      db.data.schedules.forEach(s => {
        s.isSelected = (s.scheduleId === scheduleId);
      });
      
      db.data.selectedScheduleId = scheduleId;
      await db.write();
      
      logger.info('Schedule selected', { caseId, scheduleId });
    } catch (error) {
      logger.error('Failed to select schedule', { caseId, scheduleId, error });
      throw new RepositoryError('Failed to select schedule');
    }
  }

  /**
   * Deletes a specific schedule.
   * 
   * @param caseId - The case ID
   * @param scheduleId - The schedule ID to delete
   * @throws RepositoryError if the data cannot be deleted
   */
  static async deleteSchedule(caseId: number, scheduleId: string): Promise<void> {
    try {
      // Delete the schedule file
      await deleteScheduleFile(caseId, scheduleId);
      
      // Update metadata
      const db = await getSchedulesMetadataDb(caseId);
      db.data.schedules = db.data.schedules.filter(s => s.scheduleId !== scheduleId);
      
      // If this was the selected schedule, clear selection
      if (db.data.selectedScheduleId === scheduleId) {
        db.data.selectedScheduleId = null;
      }
      
      await db.write();
      logger.info('Schedule deleted successfully', { caseId, scheduleId });
    } catch (error) {
      logger.error('Failed to delete schedule', { caseId, scheduleId, error });
      throw new RepositoryError('Failed to delete schedule');
    }
  }

  /**
   * Updates the comment for a schedule.
   * 
   * @param caseId - The case ID
   * @param scheduleId - The schedule ID
   * @param comment - The comment to set
   * @throws RepositoryError if the data cannot be updated
   */
  static async updateScheduleComment(caseId: number, scheduleId: string, comment: string): Promise<void> {
    try {
      const db = await getSchedulesMetadataDb(caseId);
      const schedule = db.data.schedules.find(s => s.scheduleId === scheduleId);
      
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      
      schedule.comment = comment;
      await db.write();
      
      logger.info('Schedule comment updated', { caseId, scheduleId });
    } catch (error) {
      logger.error('Failed to update schedule comment', { caseId, scheduleId, error });
      throw new RepositoryError('Failed to update schedule comment');
    }
  }
}

