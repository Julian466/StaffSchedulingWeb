import { getJobHistoryDb } from '@/src/infrastructure/persistence/lowdb/jobs.db';
import { SolverJob } from '@/types/solver';
import { logger } from '@/lib/logging/logger';

/**
 * Maximum number of jobs to keep in history per case.
 * Older jobs are automatically removed (FIFO).
 */
const MAX_JOBS = 10;

/**
 * Repository for managing solver job history.
 * Provides CRUD operations for solver jobs within a specific case.
 * 
 * This repository manages:
 * - Job creation and tracking
 * - Job history with automatic FIFO cleanup (max 10 jobs)
 * - Job status updates
 * - Solution retrieval
 */
export const jobRepository = {
  /**
   * Retrieves all jobs for a specific case, ordered by creation date (newest first).
   * 
   * @param caseId - The case ID to fetch jobs for
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving to an array of all jobs
   */
  async getAll(caseId: number, monthYear: string): Promise<SolverJob[]> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();
      return db.data.jobs;
    } catch (error) {
      logger.error('Failed to fetch jobs', { caseId, monthYear, error });
      throw new Error('Failed to fetch jobs');
    }
  },

  /**
   * Retrieves a specific job by its ID.
   * 
   * @param jobId - The unique identifier of the job
   * @param caseId - The case ID where the job exists
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving to the job if found, null otherwise
   */
  async getByKey(jobId: string, caseId: number, monthYear: string): Promise<SolverJob | null> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();
      const job = db.data.jobs.find((j) => j.id === jobId);
      return job || null;
    } catch (error) {
      logger.error('Failed to fetch job', { caseId, monthYear, jobId, error });
      throw new Error('Failed to fetch job');
    }
  },

  /**
   * Creates/saves a new job to the history.
      * Automatically maintains FIFO queue with max 10 jobs.
   * 
   * @param data - The job data to save
   * @param caseId - The case ID to save the job in
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving when the job is saved
   */
  async create(data: SolverJob, caseId: number, monthYear: string): Promise<void> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();

      // Add new job to the beginning
      db.data.jobs.unshift(data);

      // Maintain max jobs limit (FIFO - remove oldest)
      if (db.data.jobs.length > MAX_JOBS) {
        db.data.jobs = db.data.jobs.slice(0, MAX_JOBS);
      }

      await db.write();
      logger.info('Job saved successfully', { caseId, monthYear, jobId: data.id });
    } catch (error) {
      logger.error('Failed to save job', { caseId, monthYear, jobId: data.id, error });
      throw new Error('Failed to save job');
    }
  },

  /**
   * Updates an existing job.
   * Finds the job by ID and replaces it with the new data.
   * 
   * @param jobId - The ID of the job to update
   * @param data - The updated job data
   * @param caseId - The case ID where the job exists
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving when the job is updated
   */
  async update(jobId: string, data: SolverJob, caseId: number, monthYear: string): Promise<void> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();

      const jobIndex = db.data.jobs.findIndex((j) => j.id === jobId);
      if (jobIndex === -1) {
        throw new Error(`Job ${jobId} not found`);
      }

      db.data.jobs[jobIndex] = data;
      await db.write();
      logger.info('Job updated successfully', { caseId, monthYear, jobId });
    } catch (error) {
      logger.error('Failed to update job', { caseId, monthYear, jobId, error });
      throw new Error('Failed to update job');
    }
  },

  /**
   * Deletes a specific job by ID.
   * 
   * @param jobId - The job ID to delete
   * @param caseId - The case ID where the job exists
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving to true if job was deleted, false if not found
   */
  async delete(jobId: string, caseId: number, monthYear: string): Promise<boolean> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();

      const initialLength = db.data.jobs.length;
      db.data.jobs = db.data.jobs.filter((j) => j.id !== jobId);

      if (db.data.jobs.length < initialLength) {
        await db.write();
        logger.info('Job deleted successfully', { caseId, monthYear, jobId });
        return true;
      }

      logger.warn('Job not found for deletion', { caseId, monthYear, jobId });
      return false;
    } catch (error) {
      logger.error('Failed to delete job', { caseId, monthYear, jobId, error });
      throw new Error('Failed to delete job');
    }
  },

  /**
   * Clears all jobs for a case.
   * 
   * @param caseId - The case ID to clear jobs for
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving when all jobs are cleared
   */
  async deleteAll(caseId: number, monthYear: string): Promise<void> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();

      db.data.jobs = [];
      await db.write();
      logger.info('All jobs cleared', { caseId, monthYear });
    } catch (error) {
      logger.error('Failed to clear all jobs', { caseId, monthYear, error });
      throw new Error('Failed to clear all jobs');
    }
  },

  /**
      * Cleans up old jobs beyond the max limit (MAX_JOBS).
   * Called automatically by create, but can be called manually if needed.
   * 
   * @param caseId - The case ID to cleanup
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving when cleanup is complete
   */
  async cleanup(caseId: number, monthYear: string): Promise<void> {
    try {
      const db = await getJobHistoryDb(caseId, monthYear);
      await db.read();

      if (db.data.jobs.length > MAX_JOBS) {
        const removedCount = db.data.jobs.length - MAX_JOBS;
        db.data.jobs = db.data.jobs.slice(0, MAX_JOBS);
        await db.write();
        logger.info('Old jobs cleaned up', { caseId, monthYear, removedCount });
      }
    } catch (error) {
      logger.error('Failed to cleanup old jobs', { caseId, monthYear, error });
      throw new Error('Failed to cleanup old jobs');
    }
  },
};
