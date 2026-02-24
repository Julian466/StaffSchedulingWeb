import { createEmployeeUseCase } from '@/src/application/use-cases/employees/create-employee.use-case';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';
import { Employee } from '@/src/entities/models/employee.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class CreateEmployeeController {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(caseId: number, monthYear: string, employee: Employee): Promise<{ data: void } | { error: string }> {
    try {
      await createEmployeeUseCase(caseId, monthYear, employee, this.employeeRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
