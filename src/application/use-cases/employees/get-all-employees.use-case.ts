import { Employee } from '@/src/entities/models/employee.model';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';

export async function getAllEmployeesUseCase(
  caseId: number,
  monthYear: string,
  employeeRepository: IEmployeeRepository
): Promise<Employee[]> {
  return employeeRepository.getAll(caseId, monthYear);
}
