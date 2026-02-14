import { NextRequest, NextResponse } from 'next/server';
import { getPythonConfig } from '@/lib/config/app-config';
import { createApiLogger } from '@/lib/logging/logger';
import { existsSync } from 'fs';
import { join } from 'path';

const apiLogger = createApiLogger('/api/solver/find-file');

/**
 * GET /api/solver/find-file?filename=solution_xxx.json
 * Checks if a solution file exists in the found_solutions directory.
 * 
 * @query filename - The name of the solution file to find
 * @returns { exists: boolean, path?: string }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename parameter is required' },
        { status: 400 }
      );
    }

    const pythonConfig = getPythonConfig();
    
    if (!pythonConfig.include || !pythonConfig.path) {
      return NextResponse.json(
        { error: 'StaffScheduling project is not configured' },
        { status: 400 }
      );
    }

    // Check in found_solutions directory
    const solutionPath = join(pythonConfig.path, 'found_solutions', filename);
    const exists = existsSync(solutionPath);

    apiLogger.info('Checking solution file', {
      filename,
      path: solutionPath,
      exists,
    });

    return NextResponse.json({
      exists,
      path: exists ? solutionPath : undefined,
    });
  } catch (error) {
    apiLogger.error('Error checking solution file', { error });
    return NextResponse.json(
      {
        error: 'Failed to check solution file',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
