/**
 * Represents an employee in the shift planning system.
 * Contains basic information about the employee and their role type.
 */
export interface Employee {
  /** Unique identifier for the employee */
  key: number;
  /** Employee's first name */
  firstname: string;
  /** Employee's last name */
  name: string;
  /** Employee type/role (references an EmployeeTypeItem title) */
  type: string;
}

/**
 * Database structure for storing employee data.
 * Contains an array of all employees in the system.
 */
export interface EmployeeDatabase {
  /** Array of all employees */
  employees: Employee[];
}
