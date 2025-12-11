import { NextRequest, NextResponse } from 'next/server';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { validatePythonConfig } from '@/lib/config/app-config';
import { executeSolveMultiple } from '@/lib/services/python-cli-service';
import { jobRepository } from '@/features/solver/api/job-repository';
import { SolveMultipleParams, SolverJob } from '@/types/solver';
import { randomUUID } from 'crypto';

const apiLogger = createApiLogger('/api/solver/solve-multiple');

/**
 * POST /api/solver/solve-multiple
 * Solves the scheduling problem for multiple solutions.
 * 
 * @body { unit: number, start: string (ISO 8601), end: string (ISO 8601), maxSolutions: number, timeout?: number }
 * @returns Job result with execution details and generated schedule information
 */
export async function POST(request: NextRequest) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const body = await request.json();

    const params: SolveMultipleParams = {
      unit: body.unit ?? caseId,
      start: body.start,
      end: body.end,
      maxSolutions: body.maxSolutions,
      timeout: body.timeout,
    };

    apiLogger.info('Executing solve-multiple command', { caseId, params });

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
    const result = executeSolveMultiple(params);
    const duration = Date.now() - startTime;

    // Parse output to extract information about generated schedules
    const scheduleInfo = {
      solutionsGenerated: 0,
      scheduleFiles: [] as string[],
    };

    // Try to parse stdout for solution information
    if (result.success && result.stdout) {
      // Look for patterns like "Generated X solutions" or similar
      const lines = result.stdout.split('\n');
      for (const line of lines) {
        // This is a placeholder - adjust based on actual Python output format
        const matchCount = line.match(/generated\s+(\d+)\s+solution/i);
        if (matchCount) {
          scheduleInfo.solutionsGenerated = parseInt(matchCount[1], 10);
        }
        
        // Look for schedule file references
        const matchFile = line.match(/schedule[_-](\d+)\.json/i);
        if (matchFile) {
          scheduleInfo.scheduleFiles.push(matchFile[0]);
        }
      }
    }

    // Create job record
    const job: SolverJob = {
      id: randomUUID(),
      type: 'solve-multiple',
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

    apiLogger.info('Solve-multiple command completed', {
      caseId,
      jobId: job.id,
      success: result.success,
      duration,
      ...scheduleInfo,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Solve-multiple command failed',
          job,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      job,
      scheduleInfo,
    });
  } catch (error) {
    apiLogger.error('Error executing solve-multiple command', { error });
    return NextResponse.json(
      {
        error: 'Failed to execute solve-multiple command',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
