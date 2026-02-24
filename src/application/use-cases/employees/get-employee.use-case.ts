import { Employee } from '@/src/entities/models/employee.model';
import { EmployeeNotFoundError } from '@/src/entities/errors/employee.errors';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';

export interface IGetEmployeeUseCase {
  (input: { caseId: number; monthYear: string; key: number }): Promise<Employee>;
}

export function makeGetEmployeeUseCase(
  employeeRepository: IEmployeeRepository
): IGetEmployeeUseCase {
  return async ({ caseId, monthYear, key }) => {
    const employee = await employeeRepository.getByKey(caseId, monthYear, key);
    if (!employee) throw new EmployeeNotFoundError(key);
    return employee;
  };
}
