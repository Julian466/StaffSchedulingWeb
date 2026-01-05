import { getWishesAndBlockedDb as getDb } from '@/lib/data/wishes-and-blocked/db-wishes-and-blocked';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import {getEmployeeDb} from "@/lib/data/employees/db-employee";
import {useCase} from "@/components/case-provider";
import {generateMonthlyDataFromWeeklyData} from "@/lib/services/global-to-current-wishes-converter";
import {getCaseInformationDb} from "@/lib/data/case/db-case";

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
    const employeeDb = await getEmployeeDb(caseId);
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
   * Updates an employee's wishes and blocked data based on weekly data.
   * The weekly wishes and blocked data are expanded to monthly data
   * based on the current case's month and year.
   * This method should be always used when updating from global wishes.
   * @param key
   * @param data
   * @param caseId
   */
  async updateGeneralWishes(key: number, data: WishesAndBlockedEmployee, caseId: number): Promise<WishesAndBlockedEmployee | null> {
    const db = await getDb(caseId);
    await db.read();

    const caseInformation = await getCaseInformationDb(caseId);

    // Get the current month and year
    const year = caseInformation.data.information.year;
    const month = caseInformation.data.information.month;

    const monthlyWishesAndBlockedEmployee: Omit<WishesAndBlockedEmployee, 'key'> = generateMonthlyDataFromWeeklyData(data, year, month);


    const index = db.data.employees.findIndex(emp => emp.key === key);
    if (index === -1) await this.create(monthlyWishesAndBlockedEmployee, caseId);

    // Merge existing data with updates
    db.data.employees[index] = {
        ...db.data.employees[index],
        wish_days: monthlyWishesAndBlockedEmployee.wish_days,
        wish_shifts: monthlyWishesAndBlockedEmployee.wish_shifts,
        blocked_days: monthlyWishesAndBlockedEmployee.blocked_days,
        blocked_shifts: monthlyWishesAndBlockedEmployee.blocked_shifts,
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
