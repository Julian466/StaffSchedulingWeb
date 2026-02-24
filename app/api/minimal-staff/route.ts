import { NextResponse } from 'next/server';
import { getInjection } from '@/src/di/container';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { MinimalStaffRequirements } from '@/types/minimal-staff';

const apiLogger = createApiLogger('/api/minimal-staff');

/**
 * GET /api/minimal-staff
 * Retrieves the minimal staff requirements for the current case.
 * 
 * The case ID and monthYear are extracted from request headers.
 * 
 * @returns JSON object with minimal staff requirements
 * @returns 400 error if headers are missing
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
    apiLogger.info('Fetching minimal staff requirements', { method, caseId, monthYear });
    const controller = getInjection('GetMinimalStaffController');
    const result = await controller.execute(caseId, monthYear);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    apiLogger.info('Fetched minimal staff requirements', { method, caseId, monthYear });
    return NextResponse.json(result.data);
  } catch (error) {
    apiLogger.error('Failed to fetch minimal staff requirements', { method, caseId, monthYear, error });
    return NextResponse.json(
      { error: 'Failed to fetch minimal staff requirements' }, 
      { status: 500 }
    );
  }
}

/**
 * PUT /api/minimal-staff
 * Updates the minimal staff requirements for the current case.
 * 
 * The case ID and monthYear are extracted from request headers.
 * 
 * @param request - Request with MinimalStaffRequirements in the body
 * @returns 200 with success message
 * @returns 400 error if headers are missing or body is invalid
 * @returns 500 error if the operation fails
 */
export async function PUT(request: Request) {
  const method = 'PUT';
  let caseId: number | undefined;
  let monthYear: string | undefined;
  try {
    const context = await getCaseContextFromHeaders();
    caseId = context.caseId;
    monthYear = context.monthYear;
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    
    const requirements: MinimalStaffRequirements = await request.json();
    
    // Basic validation (HTTP concern - kept in route handler)
    if (!requirements.Fachkraft || !requirements.Azubi || !requirements.Hilfskraft) {
      return NextResponse.json({ error: 'Invalid requirements structure' }, { status: 400 });
    }
    
    apiLogger.info('Updating minimal staff requirements', { method, caseId, monthYear });
    const controller = getInjection('UpdateMinimalStaffController');
    const result = await controller.execute(caseId, monthYear, requirements);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    apiLogger.info('Updated minimal staff requirements', { method, caseId, monthYear });
    return NextResponse.json({ message: 'Requirements updated successfully' });
  } catch (error) {
    apiLogger.error('Failed to update minimal staff requirements', { method, caseId, monthYear, error });
    return NextResponse.json(
      { error: 'Failed to update minimal staff requirements' }, 
      { status: 500 }
    );
  }
}
