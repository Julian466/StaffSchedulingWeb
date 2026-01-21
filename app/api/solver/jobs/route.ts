import { NextResponse } from 'next/server';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { jobRepository } from '@/features/solver/api/job-repository';

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

    const jobs = await jobRepository.getAll(caseId, monthYear);

    apiLogger.info('Job history retrieved', {
      caseId,
      monthYear,
      jobCount: jobs.length,
    });

    return NextResponse.json({ jobs });
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
