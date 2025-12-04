import { NextResponse } from 'next/server';
import { employeeRepository } from '@/features/employees/api/employee-repository';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/employees');

/**
 * GET /api/employees
 * Retrieves all employees for the current case.
 * 
 * The case ID is extracted from the 'x-case-id' request header.
 * 
 * @returns JSON array of all employees
 * @returns 500 error if the operation fails
 */
export async function GET() {
  const method = 'GET';
  let caseId: number | undefined;
  try {
    caseId = await getCaseIdFromHeaders();
    apiLogger.info('Fetching employees', { method, caseId });
    const employees = await employeeRepository.getAll(caseId);
    apiLogger.info('Fetched employees', { method, caseId, count: employees.length });
    return NextResponse.json(employees);
  } catch (error) {
    apiLogger.error('Failed to fetch employees', { method, caseId, error });
    return NextResponse.json(
      { error: 'Failed to fetch employees' }, 
      { status: 500 }
    );
  }
}
