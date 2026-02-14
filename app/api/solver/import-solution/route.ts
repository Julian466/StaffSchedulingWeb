import { NextRequest, NextResponse } from 'next/server';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { getPythonConfig } from '@/lib/config/app-config';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ScheduleSolutionRaw } from '@/types/schedule';

const apiLogger = createApiLogger('/api/solver/import-solution');

/**
 * POST /api/solver/import-solution
 * Imports a processed solution file from the StaffScheduling project's processed_solutions folder.
 * 
 * @body { start: string (ISO 8601), end: string (ISO 8601), solutionType: string (wdefault, w0, w1, w2, etc.) }
 * @returns Success confirmation with schedule ID
 */
export async function POST(request: NextRequest) {
  let caseId: number | undefined;
  let monthYear: string | undefined;
  try {
    const context = await getCaseContextFromHeaders();
    caseId = context.caseId;
    monthYear = context.monthYear;
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const body = await request.json();

    const { start, end, solutionType } = body;

    if (!start || !end || !solutionType) {
      return NextResponse.json(
        {
          error: 'Missing required fields: start, end, solutionType',
        },
        { status: 400 }
      );
    }

    apiLogger.info('Importing processed solution', {
      caseId,
      monthYear,
      start,
      end,
      solutionType,
    });

    // Get StaffScheduling project path
    const pythonConfig = getPythonConfig();
    if (!pythonConfig.path) {
      apiLogger.error('StaffScheduling path not configured');
      return NextResponse.json(
        {
          error: 'StaffScheduling project path not configured',
        },
        { status: 400 }
      );
    }

    // Format dates for filename (YYYY-MM-DD format)
    const formatDateForFilename = (dateStr: string) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startFormatted = formatDateForFilename(start);
    const endFormatted = formatDateForFilename(end);

    // Construct expected filename: solution_{caseId}_{start}-{end}_{solutionType}_processed.json
    const filename = `solution_${caseId}_${startFormatted}-${endFormatted}_${solutionType}_processed.json`;
    const filePath = join(pythonConfig.path, 'processed_solutions', filename);

    apiLogger.info('Looking for file', { filePath });

    // Check if file exists
    if (!existsSync(filePath)) {
      apiLogger.error('Solution file not found', { filePath });
      return NextResponse.json(
        {
          error: 'Solution file not found',
          details: `Expected file: ${filename}`,
          path: filePath,
        },
        { status: 404 }
      );
    }

    // Read and parse the solution file
    let solution: ScheduleSolutionRaw;
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      solution = JSON.parse(fileContent);
    } catch (error) {
      apiLogger.error('Failed to read or parse solution file', { error, filePath });
      return NextResponse.json(
        {
          error: 'Failed to read or parse solution file',
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    // Generate a schedule ID based on timestamp and solution type
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const scheduleId = `imported_${solutionType}_${timestamp}`;
    const description = `Automatisch importiert: ${solutionType} (${startFormatted} bis ${endFormatted})`;

    // Save the schedule
    try {
      await ScheduleRepository.saveSchedule(
        caseId,
        monthYear,
        scheduleId,
        description,
        solution,
        true // Auto-select the imported schedule
      );

      apiLogger.info('Solution imported successfully', {
        caseId,
        monthYear,
        scheduleId,
        filename,
      });

      return NextResponse.json({
        success: true,
        scheduleId,
        filename,
        message: 'Solution imported successfully',
      });
    } catch (error) {
      apiLogger.error('Failed to save imported schedule', { error, scheduleId });
      return NextResponse.json(
        {
          error: 'Failed to save imported schedule',
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    apiLogger.error('Error importing solution', { error });
    return NextResponse.json(
      {
        error: 'Failed to import solution',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
