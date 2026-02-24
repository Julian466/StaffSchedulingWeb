import { NextResponse } from 'next/server';
import { getInjection } from '@/src/di/container';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
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
  let monthYear: string | undefined;
  let idNum: number | undefined;
  try {
    const context = await getCaseContextFromHeaders();
    caseId = context.caseId;
    monthYear = context.monthYear;
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const { id } = await params; // In Next.js 15+, params is a Promise
    idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    apiLogger.info('Fetching employee', { method, caseId, monthYear, employeeKey: idNum });
    const controller = getInjection('GetEmployeeController');
    const result = await controller.execute(caseId, monthYear, idNum);

    if ('error' in result) {
      return NextResponse.json(
        { error: 'Employee not found' }, 
        { status: 404 }
      );
    }
    
    apiLogger.info('Fetched employee', { method, caseId, monthYear, employeeKey: idNum });
    return NextResponse.json(result.data);
  } catch (error) {
    apiLogger.error('Failed to fetch employee', { method, caseId, monthYear, employeeKey: idNum, error });
    return NextResponse.json(
      { error: 'Failed to fetch employee' }, 
      { status: 500 }
    );
  }
}