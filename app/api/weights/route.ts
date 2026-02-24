import { NextResponse } from 'next/server';
import { getInjection } from '@/src/di/container';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/weights');

/**
 * GET /api/weights
 * Retrieves the solver weight configuration for the current case.
 * 
 * The case ID and monthYear are extracted from request headers.
 * 
 * @returns JSON object with weight configuration
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
    apiLogger.info('Fetching weights configuration', { method, caseId, monthYear });
    const controller = getInjection('GetWeightsController');
    const result = await controller.execute(caseId, monthYear);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    apiLogger.info('Fetched weights configuration', { method, caseId, monthYear });
    return NextResponse.json(result.data);
  } catch (error) {
    apiLogger.error('Failed to fetch weights configuration', { method, caseId, monthYear, error });
    return NextResponse.json(
      { error: 'Failed to fetch weights configuration' }, 
      { status: 500 }
    );
  }
}

/**
 * PUT /api/weights
 * Updates the solver weight configuration for the current case.
 * 
 * The case ID and monthYear are extracted from request headers.
 * 
 * @param request - Request with Weights in the body
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
    
    const weights = await request.json();
    apiLogger.info('Updating weights configuration', { method, caseId, monthYear });
    const controller = getInjection('UpdateWeightsController');
    const result = await controller.execute(caseId, monthYear, weights);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    apiLogger.info('Updated weights configuration', { method, caseId, monthYear });
    return NextResponse.json({ success: true });
  } catch (error) {
    apiLogger.error('Failed to update weights configuration', { method, caseId, monthYear, error });
    return NextResponse.json(
      { error: 'Failed to update weights configuration' }, 
      { status: 500 }
    );
  }
}
