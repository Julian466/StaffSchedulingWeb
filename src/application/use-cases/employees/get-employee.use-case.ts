import { Employee } from '@/src/entities/models/employee.model';
import { EmployeeNotFoundError } from '@/src/entities/errors/employee.errors';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';

export async function getEmployeeUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  employeeRepository: IEmployeeRepository
): Promise<Employee> {
  const employee = await employeeRepository.getByKey(caseId, monthYear, key);
  if (!employee) throw new EmployeeNotFoundError(key);
  return employee;
}
