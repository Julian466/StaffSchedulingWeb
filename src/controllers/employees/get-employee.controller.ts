import { getEmployeeUseCase } from '@/src/application/use-cases/employees/get-employee.use-case';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';
import { Employee } from '@/src/entities/models/employee.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetEmployeeController {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: Employee } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const employee = await getEmployeeUseCase(caseId, monthYear, key, this.employeeRepository);
      return { data: employee };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
