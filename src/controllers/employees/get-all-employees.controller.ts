import type { IGetAllEmployeesUseCase } from '@/src/application/use-cases/employees/get-all-employees.use-case';
import type { Employee } from '@/src/entities/models/employee.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export interface IGetAllEmployeesController {
  (input: { caseId: number; monthYear: string }): Promise<
    { data: Employee[] } | { error: string }
  >;
}

export function makeGetAllEmployeesController(
  getAllEmployeesUseCase: IGetAllEmployeesUseCase
): IGetAllEmployeesController {
  return async ({ caseId, monthYear }) => {
    try {
      validateMonthYear(monthYear);
      const employees = await getAllEmployeesUseCase({ caseId, monthYear });
      return { data: employees };
    } catch (error) {
      if (isDomainError(error)) return { error: error.message };
      throw error;
    }
  };
}
