import { getGlobalWishesAndBlockedDb as getDb } from "@/src/infrastructure/persistence/lowdb/global-wishes-and-blocked.db";
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import {getEmployeeDb} from "@/src/infrastructure/persistence/lowdb/employees.db";
import {wishesAndBlockedRepository} from "@/features/wishes_and_blocked/api/wishes-and-blocked-repository";

/**
 * Repository for managing wishes and blocked data.
 * Provides CRUD operations for employee wishes and blocked constraints.
 *
 * This repository manages the following aspects globally for all months in a case:
 * - Wish days (days when employees wish to work or be free)
 * - Wish shifts (specific shifts employees wish to work)
 * - Blocked days (days when employees cannot work)
 * - Blocked shifts (specific shifts employees cannot work)
 *
 * Note: This data is automatically synchronized with the main employee database
 * through event handlers. Direct manipulation should be done carefully.
 */
export const globalWishesAndBlockedRepository = {
    /**
     * Retrieves all employees with their wishes and blocked data for a specific case.
     *
     * @param caseId - The case ID to fetch data for
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving to an array of all employees with wishes and blocked data
     */
    async getAll(caseId: number, monthYear: string): Promise<WishesAndBlockedEmployee[]> {
        const db = await getDb(caseId, monthYear);
        await db.read();
        return db.data.employees;
    },

    /**
     * Retrieves a specific employee's wishes and blocked data by their key (ID).
     *
     * @param key - The unique numeric identifier of the employee
     * @param caseId - The case ID where the employee exists
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving to the employee's wishes and blocked data if found, undefined otherwise
     */
    async getByKey(key: number, caseId: number, monthYear: string): Promise<WishesAndBlockedEmployee | undefined> {
        const db = await getDb(caseId, monthYear);
        await db.read();
        return db.data.employees.find(emp => emp.key === key);
    },

    /**
     * Creates a new employee wishes and blocked entry with an auto-generated key.
     *
     * Note: This is typically called automatically when an employee is created.
     * Manual creation should be rare.
     *
     * @param data - The employee wishes and blocked data (without key)
     * @param caseId - The case ID to create the entry in
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving to the newly created employee wishes and blocked data
     */
    async create(data: Omit<WishesAndBlockedEmployee, 'key'>, caseId: number, monthYear: string, options?: { skipSyncToMonthly?: boolean }): Promise<WishesAndBlockedEmployee> {
        const db = await getDb(caseId, monthYear);
        const employeeDb = await getEmployeeDb(caseId, monthYear);
        await db.read();
        await employeeDb.read();

        // Validate that the employee exists in the main employee database
        const existingEmployee = employeeDb.data.employees.find(emp => emp.firstname == data.firstname && emp.name === data.name);

        if (!existingEmployee) {
            throw new Error(`Employee ${data.firstname} ${data.name} does not exist in the main employee database.`);
        }

        const newEmployee: WishesAndBlockedEmployee = {
            key: existingEmployee.key ,
            ...data
        };

        db.data.employees.push(newEmployee);
        await db.write();

        // Only sync to monthly wishes if not explicitly skipped
        if (!options?.skipSyncToMonthly) {
            await wishesAndBlockedRepository.updateGeneralWishes(existingEmployee.key, newEmployee, caseId, monthYear);
        }
        return newEmployee;
    },

    /**
     * Updates an employee's wishes and blocked data.
     * Can update wish days, wish shifts, blocked days, and blocked shifts.
     *
     * @param key - The unique identifier of the employee to update
     * @param data - Partial wishes and blocked data to update
     * @param caseId - The case ID where the employee exists
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving to the updated employee data, or null if not found
     */
    async update(key: number, data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>, caseId: number, monthYear: string, options?: { skipSyncToMonthly?: boolean }): Promise<WishesAndBlockedEmployee | null> {
        const db = await getDb(caseId, monthYear);
        await db.read();

        const index = db.data.employees.findIndex(emp => emp.key === key);
        if (index === -1) return null;

        // Merge existing data with updates
        db.data.employees[index] = {
            ...db.data.employees[index],
            ...data
        };

        await db.write();

        // Only sync to monthly wishes if not explicitly skipped
        if (!options?.skipSyncToMonthly) {
            await wishesAndBlockedRepository.updateGeneralWishes(key, db.data.employees[index], caseId, monthYear);
        }
        return db.data.employees[index];
    },

    /**
     * Deletes an employee's wishes and blocked data by their key.
     *
     * Note: This is typically called automatically when an employee is deleted.
     *
     * @param key - The unique identifier of the employee to delete
     * @param caseId - The case ID where the employee exists
     * @param monthYear - The month/year in MM_YYYY format
     * @returns Promise resolving to true if deleted, false if not found
     */
    async delete(key: number, caseId: number, monthYear: string): Promise<boolean> {
        const db = await getDb(caseId, monthYear);
        await db.read();

        const index = db.data.employees.findIndex(emp => emp.key === key);
        if (index === -1) return false;

        db.data.employees.splice(index, 1);
        await db.write();
        return true;
    }
};
