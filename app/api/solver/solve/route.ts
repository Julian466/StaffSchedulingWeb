import { NextRequest, NextResponse } from 'next/server';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { validatePythonConfig } from '@/lib/config/app-config';
import { executeSolve } from '@/lib/services/python-cli-service';
import { jobRepository } from '@/features/solver/api/job-repository';
import { SolveParams, SolverJob } from '@/types/solver';
import { randomUUID } from 'crypto';

const apiLogger = createApiLogger('/api/solver/solve');

/**
 * POST /api/solver/solve
 * Solves the scheduling problem for a single solution.
 * 
 * @body { unit: number, start: string (ISO 8601), end: string (ISO 8601), timeout?: number }
 * @returns Job result with execution details
 */
export async function POST(request: NextRequest) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const body = await request.json();

    const params: SolveParams = {
      unit: body.unit ?? caseId,
      start: body.start,
      end: body.end,
      timeout: body.timeout,
    };

    apiLogger.info('Executing solve command', { caseId, params });

    // Validate Python configuration
    const configValidation = validatePythonConfig();
    if (!configValidation.isValid || !configValidation.isEnabled) {
      apiLogger.error('Invalid Python configuration', {
        errors: configValidation.errors,
      });
      return NextResponse.json(
        {
          error: 'Python solver configuration is invalid',
          details: configValidation.errors.join('; '),
        },
        { status: 400 }
      );
    }

    // Execute the command
    const startTime = Date.now();
    const result = executeSolve(params);
    const duration = Date.now() - startTime;

    // Create job record
    const job: SolverJob = {
      id: randomUUID(),
      type: 'solve',
      status: result.success ? 'completed' : 'failed',
      caseId,
      params,
      result: result.success ? result : undefined,
      error: result.success ? undefined : result.stderr || 'Command failed',
      createdAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      duration,
    };

    // Save to job history
    await jobRepository.create(job, caseId);

    apiLogger.info('Solve command completed', {
      caseId,
      jobId: job.id,
      success: result.success,
      duration,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Solve command failed',
          job,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    apiLogger.error('Error executing solve command', { error });
    return NextResponse.json(
      {
        error: 'Failed to execute solve command',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
