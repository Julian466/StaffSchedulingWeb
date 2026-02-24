import { makeGetAllEmployeesUseCase, IGetAllEmployeesUseCase } from '@/src/application/use-cases/employees/get-all-employees.use-case';
import { IEmployeeRepository } from '@/src/application/ports/employee.repository';
import { Employee } from '@/src/entities/models/employee.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetAllEmployeesController {
  private readonly getAllEmployees: IGetAllEmployeesUseCase;

  constructor(employeeRepository: IEmployeeRepository) {
    this.getAllEmployees = makeGetAllEmployeesUseCase(employeeRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: Employee[] } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const employees = await this.getAllEmployees({ caseId, monthYear });
      return { data: employees };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
