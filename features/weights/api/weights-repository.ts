import { getWeightsDb } from '@/lib/data/weights/db-weights';
import { Weights } from '@/types/weights';

/**
 * Repository for managing solver weight configurations.
 * Provides operations for reading and updating weights within a specific case.
 */
export const weightsRepository = {
  /**
   * Retrieves the weight configuration for a specific case.
   * 
   * @param caseId - The case ID to fetch weights for
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving to the weights configuration
   */
  async get(caseId: number, monthYear: string): Promise<Weights> {
    const db = await getWeightsDb(caseId, monthYear);
    await db.read();
    return db.data;
  },

  /**
   * Updates the weight configuration for a specific case.
   * 
   * @param weights - The new weight configuration
   * @param caseId - The case ID to update weights for
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving when the update is complete
   */
  async update(weights: Weights, caseId: number, monthYear: string): Promise<void> {
    const db = await getWeightsDb(caseId, monthYear);
    db.data = weights;
    await db.write();
  },
};
