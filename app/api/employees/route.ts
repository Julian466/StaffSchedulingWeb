import { NextResponse } from 'next/server';
import { employeeRepository } from '@/features/employees/api/employee-repository';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/employees');

/**
 * GET /api/employees
 * Retrieves all employees for the current case.
 * 
 * The case ID and monthYear are extracted from request headers.
 * 
 * @returns JSON array of all employees
 * @returns 500 error if the operation fails
 */
export async function GET() {
  const method = 'GET';
  let caseId: number | undefined;
  let monthYear: string | undefined;
  try {
    const context = await getCaseContextFromHeaders();
    caseId = context.caseId;
    monthYear = context.monthYear;
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    apiLogger.info('Fetching employees', { method, caseId, monthYear });
    const employees = await employeeRepository.getAll(caseId, monthYear);
    apiLogger.info('Fetched employees', { method, caseId, monthYear, count: employees.length });
    return NextResponse.json(employees);
  } catch (error) {
    apiLogger.error('Failed to fetch employees', { method, caseId, monthYear, error });
    return NextResponse.json(
      { error: 'Failed to fetch employees' }, 
      { status: 500 }
    );
  }
}
