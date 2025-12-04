import { getWishesAndBlockedDb as getDb } from '@/lib/data/wishes-and-blocked/db-wishes-and-blocked';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';

/**
 * Repository for managing wishes and blocked data.
 * Provides CRUD operations for employee wishes and blocked constraints.
 * 
 * This repository manages:
 * - Wish days (days when employees wish to work or be free)
 * - Wish shifts (specific shifts employees wish to work)
 * - Blocked days (days when employees cannot work)
 * - Blocked shifts (specific shifts employees cannot work)
 * 
 * Note: This data is automatically synchronized with the main employee database
 * through event handlers. Direct manipulation should be done carefully.
 */
export const wishesAndBlockedRepository = {
  /**
   * Retrieves all employees with their wishes and blocked data for a specific case.
   * 
   * @param caseId - The case ID to fetch data for
   * @returns Promise resolving to an array of all employees with wishes and blocked data
   */
  async getAll(caseId: number): Promise<WishesAndBlockedEmployee[]> {
    const db = await getDb(caseId);
    await db.read();
    return db.data.employees;
  },

  /**
   * Retrieves a specific employee's wishes and blocked data by their key (ID).
   * 
   * @param key - The unique numeric identifier of the employee
   * @param caseId - The case ID where the employee exists
   * @returns Promise resolving to the employee's wishes and blocked data if found, undefined otherwise
   */
  async getByKey(key: number, caseId: number): Promise<WishesAndBlockedEmployee | undefined> {
    const db = await getDb(caseId);
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
   * @returns Promise resolving to the newly created employee wishes and blocked data
   */
  async create(data: Omit<WishesAndBlockedEmployee, 'key'>, caseId: number): Promise<WishesAndBlockedEmployee> {
    const db = await getDb(caseId);
    await db.read();

    // Find the highest existing key and increment
    const maxId = db.data.employees.reduce((max, emp) => Math.max(max, emp.key), 0);
    
    const newEmployee: WishesAndBlockedEmployee = {
      key: maxId + 1,
      ...data
    };
    
    db.data.employees.push(newEmployee);
    await db.write();
    return newEmployee;
  },

  /**
   * Updates an employee's wishes and blocked data.
   * Can update wish days, wish shifts, blocked days, and blocked shifts.
   * 
   * @param key - The unique identifier of the employee to update
   * @param data - Partial wishes and blocked data to update
   * @param caseId - The case ID where the employee exists
   * @returns Promise resolving to the updated employee data, or null if not found
   */
  async update(key: number, data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>, caseId: number): Promise<WishesAndBlockedEmployee | null> {
    const db = await getDb(caseId);
    await db.read();
    
    const index = db.data.employees.findIndex(emp => emp.key === key);
    if (index === -1) return null;
    
    // Merge existing data with updates
    db.data.employees[index] = {
      ...db.data.employees[index],
      ...data
    };
    
    await db.write();
    return db.data.employees[index];
  },

  /**
   * Deletes an employee's wishes and blocked data by their key.
   * 
   * Note: This is typically called automatically when an employee is deleted.
   * 
   * @param key - The unique identifier of the employee to delete
   * @param caseId - The case ID where the employee exists
   * @returns Promise resolving to true if deleted, false if not found
   */
  async delete(key: number, caseId: number): Promise<boolean> {
    const db = await getDb(caseId);
    await db.read();
    
    const index = db.data.employees.findIndex(emp => emp.key === key);
    if (index === -1) return false;
    
    db.data.employees.splice(index, 1);
    await db.write();
    return true;
  }
};
