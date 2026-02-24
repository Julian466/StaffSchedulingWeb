import { Employee } from '@/src/entities/models/employee.model';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';

export interface ICreateEmployeeUseCase {
  (input: { caseId: number; monthYear: string; employee: Employee }): Promise<void>;
}

export function makeCreateEmployeeUseCase(
  employeeRepository: IEmployeeRepository
): ICreateEmployeeUseCase {
  return async ({ caseId, monthYear, employee }) => {
    return employeeRepository.create(caseId, monthYear, employee);
  };
}
