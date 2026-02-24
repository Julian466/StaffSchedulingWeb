import { getEmployeeDb as getDb} from '@/src/infrastructure/persistence/lowdb/employees.db';
import { Employee } from '@/types/employee';


/**
 * Repository for managing employee data.
 * Provides CRUD operations for employees within a specific case.
 * 
 * This repository implements an event-driven architecture:
 * - Creates, updates, and deletes publish events
 * - Events are handled by sync handlers to maintain data consistency
 * - Free shift data is automatically synchronized via events
 */
export const employeeRepository = {
  /**
   * Retrieves all employees for a specific case.
   * 
   * @param caseId - The case ID to fetch employees for
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving to an array of all employees
   */
  async getAll(caseId: number, monthYear: string): Promise<Employee[]> {
    const db = await getDb(caseId, monthYear);
    await db.read();
    return db.data.employees;
  },

  /**
   * Retrieves a specific employee by their key (ID).
   * 
   * @param key - The unique numeric identifier of the employee
   * @param caseId - The case ID where the employee exists
   * @param monthYear - The month/year in MM_YYYY format
   * @returns Promise resolving to the employee if found, undefined otherwise
   */
  async getByKey(key: number, caseId: number, monthYear: string): Promise<Employee | undefined> {
    const db = await getDb(caseId, monthYear);
    await db.read();
    return db.data.employees.find(emp => emp.key === key);
  },
};
