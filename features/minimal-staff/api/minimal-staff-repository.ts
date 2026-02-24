import {getMinimalStaffDb} from '@/src/infrastructure/persistence/lowdb/minimal-staff.db';
import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';

/**
 * Repository for managing minimal staff requirements.
 * Provides operations for reading and updating staff requirements within a specific case.
 */
export const minimalStaffRepository = {
    /**
     * Retrieves the minimal staff requirements for a specific case.
     *
     * @param caseId - The case ID to fetch requirements for
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving to the minimal staff requirements
     */
    async get(caseId: number, monthYear: string): Promise<MinimalStaffRequirements> {
        const db = await getMinimalStaffDb(caseId, monthYear);
        await db.read();
        return db.data;
    },

    /**
     * Updates the minimal staff requirements for a specific case.
     *
     * @param requirements - The new minimal staff requirements
     * @param caseId - The case ID to update requirements for
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving when the update is complete
     */
    async update(requirements: MinimalStaffRequirements, caseId: number, monthYear: string): Promise<void> {
        const db = await getMinimalStaffDb(caseId, monthYear);
        db.data = requirements;
        await db.write();
    },
};
