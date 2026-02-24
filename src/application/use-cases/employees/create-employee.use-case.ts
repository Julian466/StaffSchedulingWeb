import { Employee } from '@/src/entities/models/employee.model';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';

export async function createEmployeeUseCase(
  caseId: number,
  monthYear: string,
  employee: Employee,
  employeeRepository: IEmployeeRepository
): Promise<void> {
  return employeeRepository.create(caseId, monthYear, employee);
}
