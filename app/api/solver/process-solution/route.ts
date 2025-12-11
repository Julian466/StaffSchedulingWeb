import { NextRequest, NextResponse } from 'next/server';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { validatePythonConfig } from '@/lib/config/app-config';
import { executeProcessSolution } from '@/lib/services/python-cli-service';
import { jobRepository } from '@/features/solver/api/job-repository';
import { ProcessSolutionParams, SolverJob } from '@/types/solver';
import { randomUUID } from 'crypto';

const apiLogger = createApiLogger('/api/solver/process-solution');

/**
 * POST /api/solver/process-solution
 * Processes a solution and exports it as JSON.
 * 
 * @body { case: number, filename?: string, output?: string, debug?: boolean }
 * @returns Job result with execution details
 */
export async function POST(request: NextRequest) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const body = await request.json();

    const params: ProcessSolutionParams = {
      case: body.case ?? caseId,
      filename: body.filename,
      output: body.output,
      debug: body.debug,
    };

    apiLogger.info('Executing process-solution command', { caseId, params });

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
    const result = executeProcessSolution(params);
    const duration = Date.now() - startTime;

    // Create job record
    const job: SolverJob = {
      id: randomUUID(),
      type: 'process-solution',
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

    apiLogger.info('Process-solution command completed', {
      caseId,
      jobId: job.id,
      success: result.success,
      duration,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Process-solution command failed',
          job,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    apiLogger.error('Error executing process-solution command', { error });
    return NextResponse.json(
      {
        error: 'Failed to execute process-solution command',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
