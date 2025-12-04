import { NextResponse } from 'next/server';
import { employeeRepository } from '@/features/employees/api/employee-repository';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/employees/[id]');

/**
 * GET /api/employees/[id]
 * Retrieves a specific employee by their key (ID) for the current case.
 * 
 * @param request - The request object
 * @param params - Route parameters containing the employee key
 * @returns JSON of the employee if found
 * @returns 400 error if ID is invalid
 * @returns 404 error if employee not found
 * @returns 500 error if the operation fails
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const method = 'GET';
  let caseId: number | undefined;
  let idNum: number | undefined;
  try {
    caseId = await getCaseIdFromHeaders();
    const { id } = await params; // In Next.js 15+, params is a Promise
    idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    apiLogger.info('Fetching employee', { method, caseId, employeeKey: idNum });
    const employee = await employeeRepository.getByKey(idNum, caseId);
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' }, 
        { status: 404 }
      );
    }
    
    apiLogger.info('Fetched employee', { method, caseId, employeeKey: idNum });
    return NextResponse.json(employee);
  } catch (error) {
    apiLogger.error('Failed to fetch employee', { method, caseId, employeeKey: idNum, error });
    return NextResponse.json(
      { error: 'Failed to fetch employee' }, 
      { status: 500 }
    );
  }
}