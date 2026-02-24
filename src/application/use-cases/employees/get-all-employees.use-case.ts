import { Employee } from '@/src/entities/models/employee.model';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';

export interface IGetAllEmployeesUseCase {
  (input: { caseId: number; monthYear: string }): Promise<Employee[]>;
}

export function makeGetAllEmployeesUseCase(
  employeeRepository: IEmployeeRepository
): IGetAllEmployeesUseCase {
  return async ({ caseId, monthYear }) => {
    return employeeRepository.getAll(caseId, monthYear);
  };
}
