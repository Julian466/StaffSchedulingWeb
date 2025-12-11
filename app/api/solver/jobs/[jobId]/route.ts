import { NextRequest, NextResponse } from 'next/server';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { jobRepository } from '@/features/solver/api/job-repository';

const apiLogger = createApiLogger('/api/solver/jobs/[jobId]');

/**
 * GET /api/solver/jobs/[jobId]
 * Retrieves a specific job by ID.
 * 
 * @returns Job record if found, 404 if not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const { jobId } = await params;

    apiLogger.info('Fetching job', { caseId, jobId });

    const job = await jobRepository.getByKey(jobId, caseId);

    if (!job) {
      apiLogger.warn('Job not found', { caseId, jobId });
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    apiLogger.info('Job retrieved', { caseId, jobId, status: job.status });

    return NextResponse.json({ job });
  } catch (error) {
    apiLogger.error('Error fetching job', { error });
    return NextResponse.json(
      {
        error: 'Failed to fetch job',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
