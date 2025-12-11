import { NextRequest, NextResponse } from 'next/server';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { jobRepository } from '@/features/solver/api/job-repository';

const apiLogger = createApiLogger('/api/solver/jobs');

/**
 * GET /api/solver/jobs
 * Retrieves job history for the current case.
 * 
 * @returns Array of job records ordered by creation date (newest first)
 */
export async function GET(request: NextRequest) {
  const method = 'GET';
  let caseId: number | undefined;
  try {
    caseId = await getCaseIdFromHeaders();
    apiLogger.info('Fetching job history', { method, caseId });

    const jobs = await jobRepository.getAll(caseId);

    apiLogger.info('Job history retrieved', {
      caseId,
      jobCount: jobs.length,
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    apiLogger.error('Error fetching job history', { error });
    return NextResponse.json(
      {
        error: 'Failed to fetch job history',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
