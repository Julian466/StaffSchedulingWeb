import { NextResponse } from 'next/server';
import { getInjection } from '@/src/di/container';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/solver/jobs');

/**
 * GET /api/solver/jobs
 * Retrieves job history for the current case.
 * 
 * @returns Array of job records ordered by creation date (newest first)
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

    apiLogger.info('Fetching job history', { method, caseId, monthYear });

    const controller = getInjection('GetAllJobsController');
    const result = await controller.execute(caseId, monthYear);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    apiLogger.info('Job history retrieved', {
      caseId,
      monthYear,
      jobCount: result.data.length,
    });

    return NextResponse.json({ jobs: result.data });
  } catch (error) {
    apiLogger.error('Error fetching job history', { method, caseId, monthYear, error });
    return NextResponse.json(
      {
        error: 'Failed to fetch job history',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
